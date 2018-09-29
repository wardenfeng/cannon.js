import { ContactEquation } from '../equations/ContactEquation';
import { Constraint } from './Constraint';
import { Body } from '../objects/Body';
import { Vec3 } from '../math/Vec3';
export declare class PointToPointConstraint extends Constraint {
    equationX: ContactEquation;
    equationY: ContactEquation;
    equationZ: ContactEquation;
    pivotA: Vec3;
    pivotB: Vec3;
    constructor(bodyA: Body, pivotA: Vec3, bodyB: Body, pivotB: Vec3, maxForce?: number);
    update(): void;
}
