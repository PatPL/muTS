var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./MuBitConverter"], function (require, exports, MuBitConverter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    MuBitConverter_1 = __importDefault(MuBitConverter_1);
    class MuKey {
        constructor(array) {
            this.Tangent = [0, 0];
            this.Time = MuBitConverter_1.default.ReadFloat(array);
            this.Value = MuBitConverter_1.default.ReadFloat(array);
            this.Tangent[0] = MuBitConverter_1.default.ReadFloat(array);
            this.Tangent[1] = MuBitConverter_1.default.ReadFloat(array);
            this.TangentMode = MuBitConverter_1.default.ReadInt(array);
        }
        Serialize(data) {
            MuBitConverter_1.default.WriteFloat(data, this.Time);
            MuBitConverter_1.default.WriteFloat(data, this.Value);
            MuBitConverter_1.default.WriteFloat(data, this.Tangent[0]);
            MuBitConverter_1.default.WriteFloat(data, this.Tangent[1]);
            MuBitConverter_1.default.WriteInt(data, this.TangentMode);
        }
    }
    exports.default = MuKey;
});
//# sourceMappingURL=MuKey.js.map