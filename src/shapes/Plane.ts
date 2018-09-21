import { Shape } from './Shape';
import { Vec3 } from '../math/Vec3';
import { Quaternion } from '../math/Quaternion';

/**
 * A plane, facing in the Z direction. The plane has its surface at z=0 and
 * everything below z=0 is assumed to be solid plane. To make the plane face
 * in some other direction than z, you must put it inside a Body and rotate that
 * body. See the demos.
 * @class Plane
 * @constructor
 * @extends Shape
 * @author schteppe
 */
export class Plane extends Shape {

  worldNormal: Vec3;
  worldNormalNeedsUpdate: boolean;

  constructor() {
    super({ type: Shape.types.PLANE });

    // World oriented normal
    this.worldNormal = new Vec3();
    this.worldNormalNeedsUpdate = true;

    this.boundingSphereRadius = Number.MAX_VALUE;
  }

  computeWorldNormal(quat: Quaternion) {
    const n = this.worldNormal;
    n.set(0, 0, 1);
    quat.vmult(n, n);
    this.worldNormalNeedsUpdate = false;
  }

  calculateLocalInertia(mass: number, target?: Vec3) {
    target = target || new Vec3();
    return target;
  }

  volume(): number {
    return Number.MAX_VALUE; // The plane is infinite...
  }

  private tempNormal = new Vec3();
  calculateWorldAABB(pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3) {
    // The plane AABB is infinite, except if the normal is pointing along any axis
    this.tempNormal.set(0, 0, 1); // Default plane normal is z
    quat.vmult(this.tempNormal, this.tempNormal);
    const maxVal = Number.MAX_VALUE;
    min.set(-maxVal, -maxVal, -maxVal);
    max.set(maxVal, maxVal, maxVal);

    if (this.tempNormal.x === 1) { max.x = pos.x; }
    if (this.tempNormal.y === 1) { max.y = pos.y; }
    if (this.tempNormal.z === 1) { max.z = pos.z; }

    if (this.tempNormal.x === -1) { min.x = pos.x; }
    if (this.tempNormal.y === -1) { min.y = pos.y; }
    if (this.tempNormal.z === -1) { min.z = pos.z; }
  }

  updateBoundingSphereRadius() {
    this.boundingSphereRadius = Number.MAX_VALUE;
  }
}
