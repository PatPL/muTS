var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./MuBitConverter"], function (require, exports, MuBitConverter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    MuBitConverter_1 = __importDefault(MuBitConverter_1);
    class MuSpring {
        constructor(array) {
            if (window.muTSlog) {
                console.log(`Reading MuSpring @${array.offset}`);
            }
            ;
            this.Spring = MuBitConverter_1.default.ReadFloat(array);
            this.Damper = MuBitConverter_1.default.ReadFloat(array);
            this.TargetPosition = MuBitConverter_1.default.ReadFloat(array);
        }
        Serialize(data) {
            MuBitConverter_1.default.WriteFloat(data, this.Spring);
            MuBitConverter_1.default.WriteFloat(data, this.Damper);
            MuBitConverter_1.default.WriteFloat(data, this.TargetPosition);
        }
    }
    exports.default = MuSpring;
});
//# sourceMappingURL=MuSpring.js.map