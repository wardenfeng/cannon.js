import { PointToPointConstraint } from './PointToPointConstraint';
import { Body } from '../objects/Body';
import { Vec3 } from '../math/Vec3';
import { RotationalEquation } from '../equations/RotationalEquation';
import { RotationalMotorEquation } from '../equations/RotationalMotorEquation';
export declare class HingeConstraint extends PointToPointConstraint {
    axisA: Vec3;
    axisB: Vec3;
    rotationalEquation1: RotationalEquation;
    rotationalEquation2: RotationalEquation;
    motorEquation: RotationalMotorEquation;
    constructor(bodyA: Body, bodyB: Body, options?: any);
    enableMotor(): void;
    disableMotor(): void;
    setMotorSpeed(speed: number): void;
    setMotorMaxForce(maxForce: number): void;
    private HingeConstraint_update_tmpVec1;
    private HingeConstraint_update_tmpVec2;
    update(): void;
}
