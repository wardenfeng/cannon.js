import { Body } from '../objects/Body';
import { Equation } from '../equations/Equation';
export declare class Constraint {
    static idCounter: number;
    id: number;
    equations: Equation[];
    bodyA: Body;
    bodyB: Body;
    collideConnected: boolean;
    constructor(bodyA: Body, bodyB: Body, options?: any);
    update(): void;
    enable(): void;
    disable(): void;
}
