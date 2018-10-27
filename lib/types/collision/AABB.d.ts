import { Vec3 } from '../math/Vec3';
import { Quaternion } from '../math/Quaternion';
import { Transform } from '../math/Transform';
import { Ray } from './Ray';
export declare class AABB {
    lowerBound: Vec3;
    upperBound: Vec3;
    constructor(options?: any);
    private tmp;
    setFromPoints(points: Vec3[], position?: Vec3, quaternion?: Quaternion, skinSize?: number): this;
    copy(aabb: AABB): AABB;
    clone(): AABB;
    extend(aabb: AABB): void;
    overlaps(aabb: AABB): boolean;
    volume(): number;
    contains(aabb: AABB): boolean;
    getCorners(a: Vec3, b: Vec3, c: Vec3, d: Vec3, e: Vec3, f: Vec3, g: Vec3, h: Vec3): void;
    private transformIntoFrame_corners;
    toLocalFrame(frame: Transform, target: AABB): AABB;
    toWorldFrame(frame: Transform, target: AABB): AABB;
    overlapsRay(ray: Ray): boolean;
    halfExtents(): Vec3;
}
