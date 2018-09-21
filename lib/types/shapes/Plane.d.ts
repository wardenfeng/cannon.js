import { Shape } from './Shape';
import { Vec3 } from '../math/Vec3';
import { Quaternion } from '../math/Quaternion';
export declare class Plane extends Shape {
    worldNormal: Vec3;
    worldNormalNeedsUpdate: boolean;
    constructor();
    computeWorldNormal(quat: Quaternion): void;
    calculateLocalInertia(mass: number, target?: Vec3): Vec3;
    volume(): number;
    private tempNormal;
    calculateWorldAABB(pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void;
    updateBoundingSphereRadius(): void;
}
