import { ActionsIterator } from "./types/AbstractSolver";
import InputParams from "./types/InputParams";
import JugAction from "./types/JugAction";
import JugsState from "./types/JugsState";

export type StateProcessor = (state: JugsState) => JugsState;
export type ExecutionStep = { action: JugAction, state: JugsState };
export type ExecutionIterator = Generator<ExecutionStep>;

export default class ActionExecutor {

    private readonly params: InputParams;

    constructor(params: InputParams) {
        this.params = params;
    }

    handlers: Record<JugAction, StateProcessor> = {
        fX: (s) => ({ x: this.params.X, y: s.y }),
        fY: (s) => ({ x: s.x, y: this.params.Y }),
        eX: (s) => ({ x: 0, y: s.y }),
        eY: (s) => ({ x: s.x, y: 0 }),
        X2Y: (state) => {
            const sum = state.x + state.y;
            const willPourX = sum > this.params.Y ? (this.params.Y - state.y) : state.x;
            return { x: state.x - willPourX, y: state.y + willPourX };
        },
        Y2X: (state) => {
            const sum = state.x + state.y;
            const willPourY = sum > this.params.X ? (this.params.X - state.x) : state.y;
            return { x: state.x + willPourY, y: state.y - willPourY };
        },
    }

    fX_X2Y(state: JugsState, n: number = 1): JugsState {
        for (let i = 0; i < n; i++) {
            state = this.handlers.X2Y(this.handlers.fX(state));
        }
        return state;
    }

    eY_X2Y(state: JugsState, n: number = 1): JugsState {
        for (let i = 0; i < n; i++) {
            state = this.handlers.X2Y(this.handlers.eY(state));
        }
        return state;
    }

    fY_Y2X(state: JugsState, n: number = 1): JugsState {
        for (let i = 0; i < n; i++) {
            state = this.handlers.Y2X(this.handlers.fY(state));
        }
        return state;
    }

    eX_Y2X(state: JugsState, n: number = 1): JugsState {
        for (let i = 0; i < n; i++) {
            state = this.handlers.Y2X(this.handlers.eX(state));
        }
        return state;
    }

    fX_X2Y_eY_X2Y(state: JugsState, n: number, a: number, b: 0 | 1): JugsState {
        for (let i = 0; i < n; i++) {
            state = this.fX_X2Y(state, a);
            state = this.eY_X2Y(state, b);
        }
        return state;
    }

    fY_Y2X_eX_Y2X(state: JugsState, n: number, b: number): JugsState {
        for (let i = 0; i < n; i++) {
            state = this.fY_Y2X(state, 1);
            state = this.eX_Y2X(state, b);
        }
        return state;
    }

    execute(state: JugsState, action: JugAction): JugsState {
        return this.handlers[action](state);
    }

    executeAll(actions: JugAction[]): JugsState {
        let state = { x: 0, y: 0 };
        for (let action of actions) {
            state = this.execute(state, action);
        }
        return state;
    }

    executionIterator(actionsIterator: ActionsIterator): ExecutionIterator {
        const that = this;
        return function*() {
            let state = { x: 0, y: 0 };
            for (let action of actionsIterator) {
                state = that.execute(state, action);
                yield { action, state };
            }
        }();
    }

}