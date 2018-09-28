import { Vec3 } from '../math/Vec3';
import { Body } from '../objects/Body';
export declare class Spring {
    restLength: number;
    stiffness: number;
    damping: number;
    bodyA: Body;
    bodyB: Body;
    localAnchorA: Vec3;
    localAnchorB: Vec3;
    constructor(bodyA: Body, bodyB: Body, options?: any);
    setWorldAnchorA(worldAnchorA: Vec3): void;
    setWorldAnchorB(worldAnchorB: Vec3): void;
    getWorldAnchorA(result: Vec3): void;
    getWorldAnchorB(result: Vec3): void;
    private applyForce_r;
    private applyForce_r_unit;
    private applyForce_u;
    private applyForce_f;
    private applyForce_worldAnchorA;
    private applyForce_worldAnchorB;
    private applyForce_ri;
    private applyForce_rj;
    private applyForce_ri_x_f;
    private applyForce_rj_x_f;
    private applyForce_tmp;
    applyForce(): void;
}
