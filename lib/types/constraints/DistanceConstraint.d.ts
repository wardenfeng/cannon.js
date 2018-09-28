import { Constraint } from './Constraint';
import { Body } from '../objects/Body';
import { ContactEquation } from '../equations/ContactEquation';
export declare class DistanceConstraint extends Constraint {
    distance: number;
    distanceEquation: ContactEquation;
    constructor(bodyA: Body, bodyB: Body, distance?: number, maxForce?: number);
    update(): void;
}
