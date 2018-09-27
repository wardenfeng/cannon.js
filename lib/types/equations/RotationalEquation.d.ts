import { Equation } from './Equation';
import { Body } from '../objects/Body';
import { Vec3 } from '../math/Vec3';
export declare class RotationalEquation extends Equation {
    axisA: Vec3;
    axisB: Vec3;
    maxAngle: number;
    constructor(bodyA: Body, bodyB: Body, options?: any);
    tmpVec1: Vec3;
    tmpVec2: Vec3;
    computeB(h: number): number;
}
