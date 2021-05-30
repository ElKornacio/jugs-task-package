"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function safeNull(smth) {
    if (smth === null || typeof smth === 'undefined') {
        throw new Error('Null safety violation');
    }
    return smth;
}
exports.default = safeNull;
//# sourceMappingURL=safeNull.js.map