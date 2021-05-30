"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swapActions = void 0;
function swapAction(swap, action) {
    if (action === 'fX') {
        return swap ? 'fY' : 'fX';
    }
    else if (action === 'fY') {
        return swap ? 'fX' : 'fY';
    }
    else if (action === 'eX') {
        return swap ? 'eY' : 'eX';
    }
    else if (action === 'eY') {
        return swap ? 'eX' : 'eY';
    }
    else if (action === 'X2Y') {
        return swap ? 'Y2X' : 'X2Y';
    }
    else if (action === 'Y2X') {
        return swap ? 'X2Y' : 'Y2X';
    }
    else {
        throw new Error('Unreachable');
    }
}
exports.default = swapAction;
function swapActions(swap, actions) {
    return actions.map(act => swapAction(swap, act));
}
exports.swapActions = swapActions;
//# sourceMappingURL=swapAction.js.map