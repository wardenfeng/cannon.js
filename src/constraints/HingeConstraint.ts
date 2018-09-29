import { PointToPointConstraint } from './PointToPointConstraint';
import { Body } from '../objects/Body';
import { Vec3 } from '../math/Vec3';
import { RotationalEquation } from '../equations/RotationalEquation';
import { RotationalMotorEquation } from '../equations/RotationalMotorEquation';

/**
 * Hinge constraint. Think of it as a door hinge. It tries to keep the
 * door in the correct place and with the correct orientation.
 * @class HingeConstraint
 * @constructor
 * @author schteppe
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {object} [options]
 * @param {Vec3} [options.pivotA] A point defined locally in bodyA. This defines the offset of axisA.
 * @param {Vec3} [options.axisA] An axis that bodyA can rotate around, defined locally in bodyA.
 * @param {Vec3} [options.pivotB]
 * @param {Vec3} [options.axisB]
 * @param {Number} [options.maxForce=1e6]
 * @extends PointToPointConstraint
 */
export class HingeConstraint extends PointToPointConstraint {
  axisA: Vec3;
  axisB: Vec3;
  rotationalEquation1: RotationalEquation;
  rotationalEquation2: RotationalEquation;
  motorEquation: RotationalMotorEquation;

  constructor(bodyA: Body, bodyB: Body, options: any = {}) {
    super(
      bodyA,
      (options.pivotA ? options.pivotA.clone() : new Vec3()),
      bodyB,
      (options.pivotB ? options.pivotB.clone() : new Vec3()),
      options.maxForce || 1e6
    );
    const maxForce = options.maxForce || 1e6;

    /**
     * Rotation axis, defined locally in bodyA.
     * @property {Vec3} axisA
     */
    this.axisA = options.axisA ? options.axisA.clone() : new Vec3(1, 0, 0);
    this.axisA.normalize();

    /**
     * Rotation axis, defined locally in bodyB.
     * @property {Vec3} axisB
     */
    this.axisB = options.axisB ? options.axisB.clone() : new Vec3(1, 0, 0);
    this.axisB.normalize();

    /**
     * @property {RotationalEquation} rotationalEquation1
     */
    this.rotationalEquation1 = new RotationalEquation(bodyA, bodyB, options);

    /**
     * @property {RotationalEquation} rotationalEquation2
     */
    this.rotationalEquation2 = new RotationalEquation(bodyA, bodyB, options);

    /**
     * @property {RotationalMotorEquation} motorEquation
     */
    this.motorEquation = new RotationalMotorEquation(bodyA, bodyB, maxForce);
    this.motorEquation.enabled = false; // Not enabled by default

    // Equations to be fed to the solver
    this.equations.push(
      this.rotationalEquation1, // rotational1
      this.rotationalEquation2, // rotational2
      this.motorEquation
    );
  }

  /**
   * @method enableMotor
   */
  enableMotor() {
    this.motorEquation.enabled = true;
  }

  /**
   * @method disableMotor
   */
  disableMotor() {
    this.motorEquation.enabled = false;
  }

  /**
   * @method setMotorSpeed
   * @param {number} speed
   */
  setMotorSpeed(speed: number) {
    this.motorEquation.targetVelocity = speed;
  }

  /**
   * @method setMotorMaxForce
   * @param {number} maxForce
   */
  setMotorMaxForce(maxForce: number) {
    this.motorEquation.maxForce = maxForce;
    this.motorEquation.minForce = -maxForce;
  }

  private HingeConstraint_update_tmpVec1 = new Vec3();
  private HingeConstraint_update_tmpVec2 = new Vec3();

  update() {
    const bodyA = this.bodyA,
      bodyB = this.bodyB,
      motor = this.motorEquation,
      r1 = this.rotationalEquation1,
      r2 = this.rotationalEquation2,
      worldAxisA = this.HingeConstraint_update_tmpVec1,
      worldAxisB = this.HingeConstraint_update_tmpVec2;

    const axisA = this.axisA;
    const axisB = this.axisB;

    super.update();

    // Get world axes
    bodyA.quaternion.vmult(axisA, worldAxisA);
    bodyB.quaternion.vmult(axisB, worldAxisB);

    worldAxisA.tangents(r1.axisA, r2.axisA);
    r1.axisB.copy(worldAxisB);
    r2.axisB.copy(worldAxisB);

    if (this.motorEquation.enabled) {
      bodyA.quaternion.vmult(this.axisA, motor.axisA);
      bodyB.quaternion.vmult(this.axisB, motor.axisB);
    }
  }
}
