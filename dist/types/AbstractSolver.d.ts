import AbstractPrinter from "./AbstractPrinter";
import InputParams from "./InputParams";
import JugAction from "./JugAction";
export declare type ActionsIterator = Generator<JugAction, void, void>;
export default abstract class AbstractSolver<T> {
    getBestSolution(params: InputParams): T;
    abstract getSolutions(params: InputParams): T[];
    abstract getBestSolutionFromServer(params: InputParams): Promise<T>;
    abstract iterateActions(solution: T): ActionsIterator;
    abstract printSolution(printer: AbstractPrinter, solution: T): void;
    abstract getSolutionLength(solution: T): number;
    convertToActions(solution: T): JugAction[];
}
