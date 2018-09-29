import { Equation } from './Equation';
import { Body } from '../objects/Body';
import { Vec3 } from '../math/Vec3';
export declare class RotationalMotorEquation extends Equation {
    axisA: Vec3;
    axisB: Vec3;
    targetVelocity: number;
    constructor(bodyA: Body, bodyB: Body, maxForce?: number);
    computeB(h: number): number;
}
