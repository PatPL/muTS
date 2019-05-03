var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./MuBitConverter"], function (require, exports, MuBitConverter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    MuBitConverter_1 = __importDefault(MuBitConverter_1);
    class MuBoneWeight {
        constructor(array) {
            let I1 = MuBitConverter_1.default.ReadInt(array);
            let W1 = MuBitConverter_1.default.ReadFloat(array);
            let I2 = MuBitConverter_1.default.ReadInt(array);
            let W2 = MuBitConverter_1.default.ReadFloat(array);
            let I3 = MuBitConverter_1.default.ReadInt(array);
            let W3 = MuBitConverter_1.default.ReadFloat(array);
            let I4 = MuBitConverter_1.default.ReadInt(array);
            let W4 = MuBitConverter_1.default.ReadFloat(array);
            this.Indices = [I1, I2, I3, I4];
            this.Weights = [W1, W2, W3, W4];
        }
        Serialize(data) {
            MuBitConverter_1.default.WriteInt(data, this.Indices[0]);
            MuBitConverter_1.default.WriteFloat(data, this.Weights[0]);
            MuBitConverter_1.default.WriteInt(data, this.Indices[1]);
            MuBitConverter_1.default.WriteFloat(data, this.Weights[1]);
            MuBitConverter_1.default.WriteInt(data, this.Indices[2]);
            MuBitConverter_1.default.WriteFloat(data, this.Weights[2]);
            MuBitConverter_1.default.WriteInt(data, this.Indices[3]);
            MuBitConverter_1.default.WriteFloat(data, this.Weights[3]);
        }
    }
    exports.default = MuBoneWeight;
});
//# sourceMappingURL=MuBoneWeight.js.map