import { Vec3 } from '../math/Vec3';
import { Body } from '../objects/Body';

/**
 * A spring, connecting two bodies.
 *
 * @class Spring
 * @constructor
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {Object} [options]
 * @param {number} [options.restLength]   A number > 0. Default: 1
 * @param {number} [options.stiffness]    A number >= 0. Default: 100
 * @param {number} [options.damping]      A number >= 0. Default: 1
 * @param {Vec3}  [options.worldAnchorA] Where to hook the spring to body A, in world coordinates.
 * @param {Vec3}  [options.worldAnchorB]
 * @param {Vec3}  [options.localAnchorA] Where to hook the spring to body A, in local body coordinates.
 * @param {Vec3}  [options.localAnchorB]
 */
export class Spring {
  restLength: number;
  stiffness: number;
  damping: number;
  bodyA: Body;
  bodyB: Body;
  localAnchorA: Vec3;
  localAnchorB: Vec3;

  constructor(bodyA: Body, bodyB: Body, options: any = {}) {
    options = options || {};

    /**
     * Rest length of the spring.
     * @property restLength
     * @type {number}
     */
    this.restLength = (options.restLength != undefined) ? options.restLength : 1;

    /**
     * Stiffness of the spring.
     * @property stiffness
     * @type {number}
     */
    this.stiffness = options.stiffness || 100;

    /**
     * Damping of the spring.
     * @property damping
     * @type {number}
     */
    this.damping = options.damping || 1;

    /**
     * First connected body.
     * @property bodyA
     * @type {Body}
     */
    this.bodyA = bodyA;

    /**
     * Second connected body.
     * @property bodyB
     * @type {Body}
     */
    this.bodyB = bodyB;

    /**
     * Anchor for bodyA in local bodyA coordinates.
     * @property localAnchorA
     * @type {Vec3}
     */
    this.localAnchorA = new Vec3();

    /**
     * Anchor for bodyB in local bodyB coordinates.
     * @property localAnchorB
     * @type {Vec3}
     */
    this.localAnchorB = new Vec3();

    if (options.localAnchorA) {
      this.localAnchorA.copy(options.localAnchorA);
    }
    if (options.localAnchorB) {
      this.localAnchorB.copy(options.localAnchorB);
    }
    if (options.worldAnchorA) {
      this.setWorldAnchorA(options.worldAnchorA);
    }
    if (options.worldAnchorB) {
      this.setWorldAnchorB(options.worldAnchorB);
    }
  }

  /**
   * Set the anchor point on body A, using world coordinates.
   * @method setWorldAnchorA
   * @param {Vec3} worldAnchorA
   */
  setWorldAnchorA(worldAnchorA: Vec3) {
    this.bodyA.pointToLocalFrame(worldAnchorA, this.localAnchorA);
  }

  /**
   * Set the anchor point on body B, using world coordinates.
   * @method setWorldAnchorB
   * @param {Vec3} worldAnchorB
   */
  setWorldAnchorB(worldAnchorB: Vec3) {
    this.bodyB.pointToLocalFrame(worldAnchorB, this.localAnchorB);
  }

  /**
   * Get the anchor point on body A, in world coordinates.
   * @method getWorldAnchorA
   * @param {Vec3} result The vector to store the result in.
   */
  getWorldAnchorA(result: Vec3) {
    this.bodyA.pointToWorldFrame(this.localAnchorA, result);
  }

  /**
   * Get the anchor point on body B, in world coordinates.
   * @method getWorldAnchorB
   * @param {Vec3} result The vector to store the result in.
   */
  getWorldAnchorB(result: Vec3) {
    this.bodyB.pointToWorldFrame(this.localAnchorB, result);
  }

  private applyForce_r = new Vec3();
  private applyForce_r_unit = new Vec3();
  private applyForce_u = new Vec3();
  private applyForce_f = new Vec3();
  private applyForce_worldAnchorA = new Vec3();
  private applyForce_worldAnchorB = new Vec3();
  private applyForce_ri = new Vec3();
  private applyForce_rj = new Vec3();
  private applyForce_ri_x_f = new Vec3();
  private applyForce_rj_x_f = new Vec3();
  private applyForce_tmp = new Vec3();

  /**
   * Apply the spring force to the connected bodies.
   * @method applyForce
   */
  applyForce() {
    const k = this.stiffness,
      d = this.damping,
      l = this.restLength,
      bodyA = this.bodyA,
      bodyB = this.bodyB,
      r = this.applyForce_r,
      r_unit = this.applyForce_r_unit,
      u = this.applyForce_u,
      f = this.applyForce_f,
      tmp = this.applyForce_tmp;

    const worldAnchorA = this.applyForce_worldAnchorA,
      worldAnchorB = this.applyForce_worldAnchorB,
      ri = this.applyForce_ri,
      rj = this.applyForce_rj,
      ri_x_f = this.applyForce_ri_x_f,
      rj_x_f = this.applyForce_rj_x_f;

    // Get world anchors
    this.getWorldAnchorA(worldAnchorA);
    this.getWorldAnchorB(worldAnchorB);

    // Get offset points
    worldAnchorA.vsub(bodyA.position, ri);
    worldAnchorB.vsub(bodyB.position, rj);

    // Compute distance vector between world anchor points
    worldAnchorB.vsub(worldAnchorA, r);
    const rlen = r.norm();
    r_unit.copy(r);
    r_unit.normalize();

    // Compute relative velocity of the anchor points, u
    bodyB.velocity.vsub(bodyA.velocity, u);
    // Add rotational velocity

    bodyB.angularVelocity.cross(rj, tmp);
    u.vadd(tmp, u);
    bodyA.angularVelocity.cross(ri, tmp);
    u.vsub(tmp, u);

    // F = - k * ( x - L ) - D * ( u )
    r_unit.mult(-k * (rlen - l) - d * u.dot(r_unit), f);

    // Add forces to bodies
    bodyA.force.vsub(f, bodyA.force);
    bodyB.force.vadd(f, bodyB.force);

    // Angular force
    ri.cross(f, ri_x_f);
    rj.cross(f, rj_x_f);
    bodyA.torque.vsub(ri_x_f, bodyA.torque);
    bodyB.torque.vadd(rj_x_f, bodyB.torque);
  }
}
