import { Solver } from './Solver';
import { World } from '../world/World';
export declare class GSSolver extends Solver {
    iterations: number;
    tolerance: number;
    constructor(iterations?: number, tolerance?: number);
    private GSSolver_solve_lambda;
    private GSSolver_solve_invCs;
    private GSSolver_solve_Bs;
    solve(dt: number, world: World): number;
}
