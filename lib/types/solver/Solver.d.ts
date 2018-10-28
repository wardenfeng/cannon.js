import { Equation } from '../equations/Equation';
import { World } from '../world/World';
export declare class Solver {
    equations: Equation[];
    iterations: number;
    tolerance: number;
    constructor();
    solve(dt: number, world: World): number;
    addEquation(eq: Equation): void;
    removeEquation(eq: Equation): void;
    removeAllEquations(): void;
}
