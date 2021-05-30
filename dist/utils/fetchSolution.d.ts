import FastMathBasedSolver from '../solvers/FastMathBasedSolver';
import SlowestRecursiveSolver from '../solvers/SlowestRecursiveSolver';
import SlowSimulationalSolver from '../solvers/SlowSimulationalSolver';
import UnhurriedSemiSimulationalSolver from '../solvers/UnhurriedSemiSimulationalSolver';
import InputParams from "../types/InputParams";
export declare type SolverType = 'fast' | 'slowest' | 'slow' | 'unhurried';
export declare const solversMap: {
    fast: typeof FastMathBasedSolver;
    slowest: typeof SlowestRecursiveSolver;
    slow: typeof SlowSimulationalSolver;
    unhurried: typeof UnhurriedSemiSimulationalSolver;
};
export default function fetchSolution<T>(solver: SolverType, params: InputParams): Promise<T>;
