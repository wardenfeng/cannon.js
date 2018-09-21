import { Vec3 } from '../math/Vec3';
import { Shape } from '../shapes/Shape';
import { Body } from '../objects/Body';
export declare class RaycastResult {
    rayFromWorld: Vec3;
    rayToWorld: Vec3;
    hitNormalWorld: Vec3;
    hitPointWorld: Vec3;
    hasHit: boolean;
    shape: Shape;
    body: Body;
    hitFaceIndex: number;
    distance: number;
    _shouldStop: boolean;
    constructor();
    reset(): void;
    abort(): void;
    set(rayFromWorld: Vec3, rayToWorld: Vec3, hitNormalWorld: Vec3, hitPointWorld: Vec3, shape: Shape, body: Body, distance: number): void;
}
