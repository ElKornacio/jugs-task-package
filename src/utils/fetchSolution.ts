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
    const path = `/solve?${querystring.stringify({ ...params, solver })}`;

    let url = `http://${document.location.hostname}:8185${path}`;
    if (document.location.hostname === 'jugs.plyoro.com') {
        url = `https://jugs.plyoro.com/api${path}`;
    }

    return fetch(url).then(response => {
        return response.json();
    })
}