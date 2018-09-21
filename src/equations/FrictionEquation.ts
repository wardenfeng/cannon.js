import { Vec3 } from '../math/Vec3';
import { Body } from '../objects/Body';
import { ContactEquation } from './ContactEquation';

/**
 * Constrains the slipping in a contact along a tangent
 * @class FrictionEquation
 * @constructor
 * @author schteppe
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {Number} slipForce should be +-F_friction = +-mu * F_normal = +-mu * m * g
 * @extends Equation
 */
export class FrictionEquation extends ContactEquation {
  ri: Vec3;
  rj: Vec3;
  t: Vec3;

  constructor(bodyA: Body, bodyB: Body, slipForce: number) {
    super(bodyA, bodyB, slipForce);

    this.ri = new Vec3();
    this.rj = new Vec3();
    this.t = new Vec3(); // tangent
  }

  private FrictionEquation_computeB_temp1 = new Vec3();
  private FrictionEquation_computeB_temp2 = new Vec3();
  computeB(h: number): number {
    const a = this.a,
      b = this.b,
      bi = this.bi,
      bj = this.bj,
      ri = this.ri,
      rj = this.rj,
      rixt = this.FrictionEquation_computeB_temp1,
      rjxt = this.FrictionEquation_computeB_temp2,
      t = this.t;

    // Caluclate cross products
    ri.cross(t, rixt);
    rj.cross(t, rjxt);

    // G = [-t -rixt t rjxt]
    // And remember, this is a pure velocity constraint, g is always zero!
    const GA = this.jacobianElementA,
      GB = this.jacobianElementB;
    t.negate(GA.spatial);
    rixt.negate(GA.rotational);
    GB.spatial.copy(t);
    GB.rotational.copy(rjxt);

    const GW = this.computeGW();
    const GiMf = this.computeGiMf();

    const B = - GW * b - h * GiMf;

    return B;
  }
}
