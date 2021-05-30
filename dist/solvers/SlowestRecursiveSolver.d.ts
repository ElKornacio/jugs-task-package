import AbstractPrinter from "../types/AbstractPrinter";
import AbstractSolver from "../types/AbstractSolver";
import InputParams from "../types/InputParams";
import JugAction from "../types/JugAction";
declare type ActionsList = JugAction[];
export default class SlowestRecursiveSolver extends AbstractSolver<ActionsList> {
    getBestSolutionFromServer(params: InputParams): Promise<ActionsList>;
    getSolutions(params: InputParams): ActionsList[];
    iterateActions(solution: ActionsList): Generator<JugAction, void, unknown>;
    printSolution(printer: AbstractPrinter, solution: ActionsList): void;
    getSolutionLength(solution: ActionsList): number;
}
export {};
