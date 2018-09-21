import { Vec3 } from '../math/Vec3';
import { Material } from '../material/Material';
import { Body } from '../objects/Body';
import { Quaternion } from '../math/Quaternion';
export declare class Shape {
    static idCounter: 0;
    static types: {
        SPHERE: number;
        PLANE: number;
        BOX: number;
        COMPOUND: number;
        CONVEXPOLYHEDRON: number;
        HEIGHTFIELD: number;
        PARTICLE: number;
        CYLINDER: number;
        TRIMESH: number;
    };
    id: number;
    type: number;
    boundingSphereRadius: number;
    collisionResponse: boolean;
    collisionFilterGroup: number;
    collisionFilterMask: number;
    material: Material;
    body: Body;
    constructor(options: any);
    updateBoundingSphereRadius(): void;
    volume(): void;
    calculateLocalInertia(mass: number, target: Vec3): void;
    calculateWorldAABB(pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void;
}
