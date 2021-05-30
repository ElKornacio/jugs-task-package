import AbstractPrinter from "./AbstractPrinter";
import InputParams from "./InputParams";
import JugAction from "./JugAction";

export type ActionsIterator = Generator<JugAction, void, void>;

export default abstract class AbstractSolver<T> {

    getBestSolution(params: InputParams): T {
        const all = this.getSolutions(params);
        const min = Math.min(...all.map(a => this.getSolutionLength(a)));
        return all.find(a => this.getSolutionLength(a) === min)!;
    }

    abstract getSolutions(params: InputParams): T[];
    abstract getBestSolutionFromServer(params: InputParams): Promise<T>;
    
    abstract iterateActions(solution: T): ActionsIterator;
    abstract printSolution(printer: AbstractPrinter, solution: T): void;
    abstract getSolutionLength(solution: T): number;

    convertToActions(solution: T): JugAction[] {
        return [...this.iterateActions(solution)];
    }

}