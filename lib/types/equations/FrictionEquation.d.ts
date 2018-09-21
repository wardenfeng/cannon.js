import { Vec3 } from '../math/Vec3';
import { Body } from '../objects/Body';
import { ContactEquation } from './ContactEquation';
export declare class FrictionEquation extends ContactEquation {
    ri: Vec3;
    rj: Vec3;
    t: Vec3;
    constructor(bodyA: Body, bodyB: Body, slipForce: number);
    private FrictionEquation_computeB_temp1;
    private FrictionEquation_computeB_temp2;
    computeB(h: number): number;
}
