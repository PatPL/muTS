var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./MuBitConverter"], function (require, exports, MuBitConverter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    MuBitConverter_1 = __importDefault(MuBitConverter_1);
    class MuFriction {
        constructor(array) {
            if (window.muTSlog) {
                console.log(`Reading MuFriction @${array.offset}`);
            }
            ;
            this.ExtremumSlip = MuBitConverter_1.default.ReadFloat(array);
            this.ExtremumValue = MuBitConverter_1.default.ReadFloat(array);
            this.AsymptoteSlip = MuBitConverter_1.default.ReadFloat(array);
            this.AsymptoteValue = MuBitConverter_1.default.ReadFloat(array);
            this.Stiffness = MuBitConverter_1.default.ReadFloat(array);
        }
        Serialize(data) {
            MuBitConverter_1.default.WriteFloat(data, this.ExtremumSlip);
            MuBitConverter_1.default.WriteFloat(data, this.ExtremumValue);
            MuBitConverter_1.default.WriteFloat(data, this.AsymptoteSlip);
            MuBitConverter_1.default.WriteFloat(data, this.AsymptoteValue);
            MuBitConverter_1.default.WriteFloat(data, this.Stiffness);
        }
    }
    exports.default = MuFriction;
});
//# sourceMappingURL=MuFriction.js.map