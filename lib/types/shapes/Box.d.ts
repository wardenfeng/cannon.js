import { Shape } from './Shape';
import { Vec3 } from '../math/Vec3';
import { ConvexPolyhedron } from './ConvexPolyhedron';
import { Quaternion } from '../math/Quaternion';
export declare class Box extends Shape {
    halfExtents: Vec3;
    convexPolyhedronRepresentation: ConvexPolyhedron;
    constructor(halfExtents: Vec3);
    updateConvexPolyhedronRepresentation(): void;
    calculateLocalInertia(mass: number, target: Vec3): Vec3;
    static calculateInertia(halfExtents: Vec3, mass: number, target: Vec3): void;
    getSideNormals(sixTargetVectors: Vec3[], quat: Quaternion): Vec3[];
    volume(): number;
    updateBoundingSphereRadius(): void;
    private worldCornerTempPos;
    private worldCornerTempNeg;
    private worldCornersTemp;
    forEachWorldCorner(pos: Vec3, quat: Quaternion, callback: Function): void;
    calculateWorldAABB(pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void;
}
