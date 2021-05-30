"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.solversMap = void 0;
const querystring_1 = __importDefault(require("querystring"));
const FastMathBasedSolver_1 = __importDefault(require("../solvers/FastMathBasedSolver"));
const SlowestRecursiveSolver_1 = __importDefault(require("../solvers/SlowestRecursiveSolver"));
const SlowSimulationalSolver_1 = __importDefault(require("../solvers/SlowSimulationalSolver"));
const UnhurriedSemiSimulationalSolver_1 = __importDefault(require("../solvers/UnhurriedSemiSimulationalSolver"));
exports.solversMap = {
    fast: FastMathBasedSolver_1.default,
    slowest: SlowestRecursiveSolver_1.default,
    slow: SlowSimulationalSolver_1.default,
    unhurried: UnhurriedSemiSimulationalSolver_1.default,
};
function fetchSolution(solver, params) {
    return fetch(`http://${document.location.hostname}:8185/solve?${querystring_1.default.stringify({ ...params, solver })}`).then(response => {
        return response.json();
    });
}
exports.default = fetchSolution;
//# sourceMappingURL=fetchSolution.js.map