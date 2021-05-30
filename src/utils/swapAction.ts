import JugAction from "../types/JugAction";

export default function swapAction(swap: boolean, action: JugAction): JugAction {
    if (action === 'fX') {
        return swap ? 'fY' : 'fX';
    } else
    if (action === 'fY') {
        return swap ? 'fX' : 'fY';
    } else
    if (action === 'eX') {
        return swap ? 'eY' : 'eX';
    } else
    if (action === 'eY') {
        return swap ? 'eX' : 'eY';
    } else
    if (action === 'X2Y') {
        return swap ? 'Y2X' : 'X2Y';
    } else
    if (action === 'Y2X') {
        return swap ? 'X2Y' : 'Y2X';
    } else {
        throw new Error('Unreachable');
    }
}

export function swapActions(swap: boolean, actions: JugAction[]): JugAction[] {
    return actions.map(act => swapAction(swap, act));
}