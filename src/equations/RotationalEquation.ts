import { Equation } from './Equation';
import { Body } from '../objects/Body';
import { Vec3 } from '../math/Vec3';

/**
 * Rotational constraint. Works to keep the local vectors orthogonal to each other in world space.
 * @class RotationalEquation
 * @constructor
 * @author schteppe
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {Vec3} [options.axisA]
 * @param {Vec3} [options.axisB]
 * @param {number} [options.maxForce]
 * @extends Equation
 */
export class RotationalEquation extends Equation {
  axisA: Vec3;
  axisB: Vec3;
  maxAngle: number;

  constructor(bodyA: Body, bodyB: Body, options: any = {}) {
    super(bodyA, bodyB,
      -((options.maxForce) ? options.maxForce : 1e6),
      ((options.maxForce) ? options.maxForce : 1e6));

    this.axisA = options.axisA ? options.axisA.clone() : new Vec3(1, 0, 0);
    this.axisB = options.axisB ? options.axisB.clone() : new Vec3(0, 1, 0);

    this.maxAngle = Math.PI / 2;
  }

  tmpVec1 = new Vec3();
  tmpVec2 = new Vec3();

  computeB(h: number) {
    const a = this.a,
      b = this.b,

      ni = this.axisA,
      nj = this.axisB,

      nixnj = this.tmpVec1,
      njxni = this.tmpVec2,

      GA = this.jacobianElementA,
      GB = this.jacobianElementB;

    // Caluclate cross products
    ni.cross(nj, nixnj);
    nj.cross(ni, njxni);

    // g = ni * nj
    // gdot = (nj x ni) * wi + (ni x nj) * wj
    // G = [0 njxni 0 nixnj]
    // W = [vi wi vj wj]
    GA.rotational.copy(njxni);
    GB.rotational.copy(nixnj);

    const g = Math.cos(this.maxAngle) - ni.dot(nj),
      GW = this.computeGW(),
      GiMf = this.computeGiMf();

    const B = - g * a - GW * b - h * GiMf;

    return B;
  }
}
