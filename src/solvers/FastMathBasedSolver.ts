import ActionExecutor from "../ActionExecutor";
import AbstractPrinter from "../types/AbstractPrinter";
import AbstractSolver from "../types/AbstractSolver";
import InputParams from "../types/InputParams";
import JugAction from "../types/JugAction";
import ceilAndPart from "../utils/ceilAndPart";
import fetchSolution from "../utils/fetchSolution";
import swapAction from "../utils/swapAction";

interface ICompactAction {
    mode: 'fX_X2Y_eY_X2Y' | 'fY_Y2X_eX_Y2X';
    state: number[];
    lastOrphan: boolean;
}

interface ISimpleSolution {
    type: 'simple';
    swap: boolean;
    actions: { chord: JugAction[], n: number }[];
}

interface INoSolution {
    type: 'no';
}

interface ICompactSolution {
    type: 'compact';
    swap: boolean;
    action: ICompactAction;
}

export type ISolution = ISimpleSolution | INoSolution | ICompactSolution;

export default class FastMathBasedSolver extends AbstractSolver<ISolution> {
    
    async getBestSolutionFromServer(params: InputParams): Promise<ISolution> {
        return fetchSolution<ISolution>('fast', params);
    }

    getSolutions(params: InputParams): ISolution[] {
        let { X, Y, Z } = params;

        let swap = false;
        if (X > Y) {
            swap = true;
            [X, Y] = [Y, X];
        }

        const executor = new ActionExecutor({ X, Y, Z });

        if (Z > Y) {
            return [{ type: 'no' }];
        }
        if (Z === Y) {
            return [{ type: 'simple', swap, actions: [{ chord: ['fY'], n: 1 }] }];
        }
        if (Z === X) {
            return [{ type: 'simple', swap, actions: [{ chord: ['fX'], n: 1 }] }];
        }

        const firstSol = (Z % X === 0) ? ((Z / X) * 2) : false;
        const secondSol = ((Y - Z) % X === 0) ? (1 + ((Y - Z) / X) * 2 - 1) : false;
        let desc: 0 | 1 | 2 = 0;
        if (firstSol && secondSol) {
            if (firstSol < secondSol) {
                desc = 1;
            } else {
                desc = 2;
            }
        } else
            if (firstSol) {
                desc = 1
            } else
            if (secondSol) {
                desc = 2;
            }
        if (desc === 1 && firstSol) {
            return [{
                type: 'simple',
                swap,
                actions: [
                    {
                        chord: ['fX', 'X2Y'],
                        n: (firstSol % 2 === 0) ? (firstSol / 2) : (firstSol - 1) / 2
                    },
                    {
                        chord: ['fX'],
                        n: (firstSol % 2)
                    }
                ]
            }]
        } else
        if (desc === 2 && secondSol) {
            return [{
                type: 'simple',
                swap,
                actions: [
                    {
                        chord: ['fY'],
                        n: 1
                    },
                    {
                        chord: ['Y2X', 'eX'],
                        n: (secondSol % 2 === 0) ? (secondSol / 2 - 1) : (secondSol - 1) / 2
                    },
                    {
                        chord: ['Y2X'],
                        n: (secondSol % 2 === 0) ? 1 : 0
                    }
                ]
            }]
        }

        if (Y % X === 0) {
            return [{ type: 'no' }];
        }

        function actForY(): ISolution {
            // fY_Y2X_eX_Y2X
            let history: number[] = [];
            let state = { x: 0, y: 0 };
            const wasInState: Record<string, true> = {};
            while (true) {
                state = executor.fY_Y2X(state, 1);
                if (wasInState[state.x + ':' + state.y]) {
                    return { type: 'no' };
                } else {
                    wasInState[state.x + ':' + state.y] = true;
                }
                if (state.x === Z || state.y === Z) {
                    history.push(0);
                    break;
                }
                let b = 0;
                if ((state.y - Z) % X === 0) {
                    b = (state.y - Z) / X;
                    state.x = X;
                    state.y = Z;
                } else {
                    const { ceil, part } = ceilAndPart(state.y, X);
                    b = ceil + (part ? 1 : 0);
                    if (b > 0) {
                        state.x = state.y % X;
                        state.y = 0;
                    }
                }
                history.push(b);

                if (state.x === Z || state.y === Z) {
                    break;
                }
            }
            return {
                type: 'compact',
                swap,
                action: {
                    mode: 'fY_Y2X_eX_Y2X',
                    state: history,
                    lastOrphan: false,
                }
            }
        }

        function actForX(): ISolution {
            // fX_X2Y_eY_X2Y
            let history: number[] = [];
            let state = { x: 0, y: 0 };
            const wasInState: Record<string, true> = {};
            let lastOrphan = false;
            while (true) {
                if (wasInState[state.x + ':' + state.y]) {
                    return { type: 'no' };
                } else {
                    wasInState[state.x + ':' + state.y] = true;
                }

                let a = 0;
                if ((Z - state.y) % X === 0) {
                    a = (Z - state.y) / X;
                    state.x = 0;
                    state.y = Z;
                } else {
                    const { ceil, part } = ceilAndPart(Y - state.y, X);
                    a = ceil + (part ? 1 : 0);
                    if (a > 0) {
                        state.x = X - ((Y - state.y) % X);
                        state.y = Y;
                    }
                }

                history.push(a);
                if (state.x === Z || state.y === Z) {
                    lastOrphan = true;
                    break;
                }

                state = executor.eY_X2Y(state, 1);

                if (state.x === Z || state.y === Z) {
                    break;
                }
            }
            return {
                type: 'compact',
                swap,
                action: {
                    mode: 'fX_X2Y_eY_X2Y',
                    state: history,
                    lastOrphan,
                }
            }
        }

        const a = actForX();
        const b = actForY();
        const aLen = this.getSolutionLength(a);
        const bLen = this.getSolutionLength(b);
        if (!aLen) {
            return [b];
        }
        if (!bLen) {
            return [a];
        }

        if (aLen < bLen) {
            return [a];
        } else {
            return [b];
        }
    }

    iterateActions(solution: ISolution) {
        return function*() {
            const swap = (solution.type !== 'no') ? solution.swap : false;

            if (solution.type === 'no') {
                return;
            } else
            if (solution.type === 'simple') {
                for (let action of solution.actions) {
                    for (let i = 0; i < action.n; i++) {
                        for (let c of action.chord) {
                            yield swapAction(swap, c);
                        }
                    }
                }
            } else
            if (solution.type === 'compact') {
                let i = 0;
                for (let action of solution.action.state) {
                    if (solution.action.mode === 'fX_X2Y_eY_X2Y') {
                        for (let j = 0; j < action; j++) {
                            yield swapAction(swap, 'fX');
                            yield swapAction(swap, 'X2Y');
                        }
                        if (i === solution.action.state.length - 1 && solution.action.lastOrphan) {
                            //
                        } else {
                            yield swapAction(swap, 'eY');
                            yield swapAction(swap, 'X2Y');
                        }
                    } else {
                        yield swapAction(swap, 'fY');
                        yield swapAction(swap, 'Y2X');
                        for (let j = 0; j < action; j++) {
                            yield swapAction(swap, 'eX');
                            yield swapAction(swap, 'Y2X');
                        }
                    }
                    i++;
                }
            }
        }();
    }

    printSolution(printer: AbstractPrinter, solution: ISolution): void {
        if (solution.type === 'no') {
            printer.writeLn('No solution')
        } else
        if (solution.type === 'simple') {
            printer.writeLn('Simple solution (' + this.getSolutionLength(solution) + '):');
            printer.writeLn();
            for (let action of solution.actions) {
                if (action.n) {
                    printer.writeLn(action.chord.join('_') + `(n=${action.n})`);
                }
            }
        } else
        if (solution.type === 'compact') {
            printer.writeLn('Compact solution (' + this.getSolutionLength(solution) + '):');
            printer.writeLn();
            let i = 0;
            for (let action of solution.action.state) {
                if (solution.action.mode === 'fX_X2Y_eY_X2Y') {
                    printer.writeLn('fX_X2Y_eY_X2Y(a=' + action + ';b=' + ((i === solution.action.state.length - 1 && solution.action.lastOrphan) ? 0 : 1) + ')')
                } else {
                    printer.writeLn('fY_Y2X_eX_Y2X(a=1;b=' + action + ')');
                }
                i++;
            }
        }
    }

    getSolutionLength(solution: ISolution): number {
        if (solution.type === 'no') {
            return 0;
        } else
        if (solution.type === 'simple') {
            return solution.actions.map(a => a.chord.length * a.n).reduce((p, c) => p + c, 0);
        } else
        if (solution.type === 'compact') {
            if (solution.action.mode === 'fX_X2Y_eY_X2Y') {
                return solution.action.state.map(s => 2 + 2 * s).reduce((p, c) => p + c, 0) - (solution.action.lastOrphan ? 2 : 0)
            } else
            if (solution.action.mode === 'fY_Y2X_eX_Y2X') {
                return solution.action.state.map(s => 2 + 2 * s).reduce((p, c) => p + c, 0);
            } else {
                throw new Error('Unreachable');
            }
        } else {
            throw new Error('Unreachable');
        }
    }
}