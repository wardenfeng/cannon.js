import { PointToPointConstraint } from './PointToPointConstraint';
import { Body } from '../objects/Body';
import { Vec3 } from '../math/Vec3';
import { RotationalEquation } from '../equations/RotationalEquation';
export declare class LockConstraint extends PointToPointConstraint {
    xA: Vec3;
    xB: Vec3;
    yA: Vec3;
    yB: Vec3;
    zA: Vec3;
    zB: Vec3;
    rotationalEquation1: RotationalEquation;
    rotationalEquation2: RotationalEquation;
    rotationalEquation3: RotationalEquation;
    constructor(bodyA: Body, bodyB: Body, options?: any);
    LockConstraint_update_tmpVec1: Vec3;
    LockConstraint_update_tmpVec2: Vec3;
    update(): void;
}
