import AbstractPrinter from "../types/AbstractPrinter";
import AbstractSolver from "../types/AbstractSolver";
import InputParams from "../types/InputParams";
import JugAction from "../types/JugAction";
interface ICompactAction {
    mode: 'fX_X2Y_eY_X2Y' | 'fY_Y2X_eX_Y2X';
    state: number[];
    lastOrphan: boolean;
}
interface ISimpleSolution {
    type: 'simple';
    swap: boolean;
    actions: {
        chord: JugAction[];
        n: number;
    }[];
}
interface INoSolution {
    type: 'no';
}
interface ICompactSolution {
    type: 'compact';
    swap: boolean;
    action: ICompactAction;
}
export declare type ISolution = ISimpleSolution | INoSolution | ICompactSolution;
export default class FastMathBasedSolver extends AbstractSolver<ISolution> {
    getBestSolutionFromServer(params: InputParams): Promise<ISolution>;
    getSolutions(params: InputParams): ISolution[];
    iterateActions(solution: ISolution): Generator<"fX" | "fY" | "eX" | "eY" | "X2Y" | "Y2X", void, unknown>;
    printSolution(printer: AbstractPrinter, solution: ISolution): void;
    getSolutionLength(solution: ISolution): number;
}
export {};
