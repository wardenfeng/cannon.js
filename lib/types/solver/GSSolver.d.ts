import { Solver } from './Solver';
export declare class GSSolver extends Solver {
    iterations: number;
    tolerance: number;
    constructor();
    private GSSolver_solve_lambda;
    private GSSolver_solve_invCs;
    private GSSolver_solve_Bs;
    solve(dt: number, world: any): number;
}
