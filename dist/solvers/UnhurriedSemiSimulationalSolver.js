"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ActionExecutor_1 = __importDefault(require("../ActionExecutor"));
const AbstractSolver_1 = __importDefault(require("../types/AbstractSolver"));
const arraysEqual_1 = __importDefault(require("../utils/arraysEqual"));
const fetchSolution_1 = __importDefault(require("../utils/fetchSolution"));
const generateTupleArray_1 = __importDefault(require("../utils/generateTupleArray"));
const printActions_1 = __importDefault(require("../utils/printActions"));
const swapAction_1 = require("../utils/swapAction");
class UnhurriedSemiSimulationalSolver extends AbstractSolver_1.default {
    getSolutions(params) {
        let { X, Y, Z } = params;
        let swap = false;
        if (X > Y) {
            swap = true;
            [X, Y] = [Y, X];
        }
        const executor = new ActionExecutor_1.default({ X, Y, Z });
        if (Z > Y) {
            return [[]];
        }
        if (Z === Y) {
            return [swapAction_1.swapActions(swap, ['fY'])];
        }
        if (Z === X) {
            return [swapAction_1.swapActions(swap, ['fX'])];
        }
        if (Z % X === 0) {
            const firstSol = (Z / X) * 2;
            const secondSol = 1 + ((Y - Z) / X) * 2 - 1;
            if ((Y - Z) % X === 0 && (secondSol < firstSol)) {
                return [swapAction_1.swapActions(swap, ['fY'].concat(generateTupleArray_1.default(secondSol - 1, 'Y2X', 'eX')))];
            }
            else {
                return [swapAction_1.swapActions(swap, generateTupleArray_1.default(firstSol, 'fX', 'X2Y'))];
            }
        }
        if (Y % X === 0) {
            return [[]];
        }
        function act(startFromfX) {
            const opt = true;
            let stack = [{ state: { x: 0, y: 0 }, branch: 0 }];
            let history = [];
            let results = [];
            const wasInState = {};
            while (stack.length) {
                const pos = stack[stack.length - 1];
                const { state, branch } = pos;
                if (state.x === Z || state.y === Z) {
                    results.push(history.slice().flat());
                    stack.pop();
                    history.pop();
                    continue;
                }
                if (branch === 0 && wasInState[state.x + ':' + state.y]) {
                    stack.pop();
                    history.pop();
                    continue;
                }
                wasInState[state.x + ':' + state.y] = true;
                if (branch === 0) {
                    pos.branch++;
                    if (startFromfX) {
                        history.push(['fX', 'X2Y']);
                        stack.push({ state: executor.fX_X2Y(state, 1), branch: 0 });
                    }
                    else {
                        const historyBulk = ['fY', 'Y2X'];
                        let newState = executor.fY_Y2X(state, 1);
                        // history.push(['fY', 'Y2X']);
                        // stack.push({ state: newState, branch: opt ? 1 : 0 });
                        let n = 0;
                        while (newState.x === X && newState.y != 0) {
                            if (newState.x === Z || newState.y === Z) {
                                break;
                            }
                            const oldState = newState;
                            newState = executor.eX_Y2X(newState, 1);
                            if (wasInState[newState.x + ':' + newState.y]) {
                                newState = oldState;
                                break;
                            }
                            historyBulk.push('eX', 'Y2X');
                            n++;
                            // stack.push({ state: newState, branch: 0 });
                        }
                        history.push(historyBulk);
                        stack.push({ state: newState, branch: 0 });
                    }
                }
                else if (branch === 1) {
                    pos.branch++;
                    if (startFromfX) {
                        if (opt && history.length >= 1 && arraysEqual_1.default(history[history.length - 1], ['eY', 'X2Y'])) {
                            continue;
                        }
                        else {
                            history.push(['eY', 'X2Y']);
                            stack.push({ state: executor.eY_X2Y(state, 1), branch: 0 });
                        }
                    }
                    else {
                        history.push(['eX', 'Y2X']);
                        stack.push({ state: executor.eX_Y2X(state, 1), branch: 0 });
                    }
                }
                else {
                    stack.pop();
                    history.pop();
                    delete wasInState[state.x + ':' + state.y];
                }
            }
            return results;
        }
        const solutionX = act(true);
        const solutionY = act(false);
        if (!solutionX.length) {
            return solutionY.length ? solutionY.map(s => swapAction_1.swapActions(swap, s)) : [[]];
        }
        if (!solutionY.length) {
            return solutionX.length ? solutionX.map(s => swapAction_1.swapActions(swap, s)) : [[]];
        }
        const aMin = Math.min(...solutionX.map(t => t.length));
        const bMin = Math.min(...solutionY.map(t => t.length));
        if (aMin < bMin) {
            return solutionX.map(s => swapAction_1.swapActions(swap, s));
        }
        else {
            return solutionY.map(s => swapAction_1.swapActions(swap, s));
        }
    }
    iterateActions(solution) {
        return function* () {
            for (let action of solution) {
                yield action;
            }
        }();
    }
    async getBestSolutionFromServer(params) {
        return fetchSolution_1.default('unhurried', params);
    }
    printSolution(printer, solution) {
        printActions_1.default(null, printer, solution);
    }
    getSolutionLength(solution) {
        return solution.length;
    }
}
exports.default = UnhurriedSemiSimulationalSolver;
//# sourceMappingURL=UnhurriedSemiSimulationalSolver.js.map