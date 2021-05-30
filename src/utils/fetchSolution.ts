import querystring from 'querystring';
import FastMathBasedSolver from '../solvers/FastMathBasedSolver';
import SlowestRecursiveSolver from '../solvers/SlowestRecursiveSolver';
import SlowSimulationalSolver from '../solvers/SlowSimulationalSolver';
import UnhurriedSemiSimulationalSolver from '../solvers/UnhurriedSemiSimulationalSolver';

import InputParams from "../types/InputParams";

export type SolverType = 'fast' | 'slowest' | 'slow' | 'unhurried';

export const solversMap = {
    fast: FastMathBasedSolver,
    slowest: SlowestRecursiveSolver,
    slow: SlowSimulationalSolver,
    unhurried: UnhurriedSemiSimulationalSolver,
}

export default function fetchSolution<T>(solver: SolverType, params: InputParams): Promise<T> {
    return fetch('http://localhost:8185/solve?' + querystring.stringify({ ...params, solver })).then(response => {
        return response.json();
    })
}