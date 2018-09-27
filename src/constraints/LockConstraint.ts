import { PointToPointConstraint } from './PointToPointConstraint';
import { Body } from '../objects/Body';
import { Vec3, Vec3Consts } from '../math/Vec3';
import { RotationalEquation } from '../equations/RotationalEquation';

/**
 * Lock constraint. Will remove all degrees of freedom between the bodies.
 * @class LockConstraint
 * @constructor
 * @author schteppe
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {object} [options]
 * @param {Number} [options.maxForce=1e6]
 * @extends PointToPointConstraint
 */
export class LockConstraint extends PointToPointConstraint {
  xA: Vec3;
  xB: Vec3;
  yA: Vec3;
  yB: Vec3;
  zA: Vec3;
  zB: Vec3;

  rotationalEquation1: RotationalEquation;
  rotationalEquation2: RotationalEquation;
  rotationalEquation3: RotationalEquation;

  // motorEquation: MotorEquation;

  constructor(bodyA: Body, bodyB: Body, options: any = {}) {
    // The point-to-point constraint will keep a point shared between the bodies
    super(bodyA, new Vec3(), bodyB, new Vec3(), (options.maxForce) ? options.maxForce : 1e6);

    const halfWay = new Vec3();
    bodyA.position.vadd(bodyB.position, halfWay);
    halfWay.scale(0.5, halfWay);
    bodyB.pointToLocalFrame(halfWay, this.pivotB);
    bodyA.pointToLocalFrame(halfWay, this.pivotA);

    // Store initial rotation of the bodies as unit vectors in the local body spaces
    this.xA = bodyA.vectorToLocalFrame(Vec3Consts.UNIT_X);
    this.xB = bodyB.vectorToLocalFrame(Vec3Consts.UNIT_X);
    this.yA = bodyA.vectorToLocalFrame(Vec3Consts.UNIT_Y);
    this.yB = bodyB.vectorToLocalFrame(Vec3Consts.UNIT_Y);
    this.zA = bodyA.vectorToLocalFrame(Vec3Consts.UNIT_Z);
    this.zB = bodyB.vectorToLocalFrame(Vec3Consts.UNIT_Z);

    // ...and the following rotational equations will keep all rotational DOF's in place

    /**
     * @property {RotationalEquation} rotationalEquation1
     */
    const r1 = this.rotationalEquation1 = new RotationalEquation(bodyA, bodyB, options);

    /**
     * @property {RotationalEquation} rotationalEquation2
     */
    const r2 = this.rotationalEquation2 = new RotationalEquation(bodyA, bodyB, options);

    /**
     * @property {RotationalEquation} rotationalEquation3
     */
    const r3 = this.rotationalEquation3 = new RotationalEquation(bodyA, bodyB, options);

    this.equations.push(r1, r2, r3);
  }

  LockConstraint_update_tmpVec1 = new Vec3();
  LockConstraint_update_tmpVec2 = new Vec3();

  update() {
    const bodyA = this.bodyA,
      bodyB = this.bodyB,
      // motor = this.motorEquation,
      r1 = this.rotationalEquation1,
      r2 = this.rotationalEquation2,
      r3 = this.rotationalEquation3,
      worldAxisA = this.LockConstraint_update_tmpVec1,
      worldAxisB = this.LockConstraint_update_tmpVec2;

    // PointToPointConstraint.prototype.update.call(this);
    super.update();

    // These vector pairs must be orthogonal
    bodyA.vectorToWorldFrame(this.xA, r1.axisA);
    bodyB.vectorToWorldFrame(this.yB, r1.axisB);

    bodyA.vectorToWorldFrame(this.yA, r2.axisA);
    bodyB.vectorToWorldFrame(this.zB, r2.axisB);

    bodyA.vectorToWorldFrame(this.zA, r3.axisA);
    bodyB.vectorToWorldFrame(this.xB, r3.axisB);
  }
}

