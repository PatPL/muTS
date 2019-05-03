var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./MuBitConverter"], function (require, exports, MuBitConverter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    MuBitConverter_1 = __importDefault(MuBitConverter_1);
    class MuTransform {
        constructor(array) {
            this.Name = MuBitConverter_1.default.ReadString(array);
            this.LocalPosition = MuBitConverter_1.default.ReadVector(array);
            this.LocalRotation = MuBitConverter_1.default.ReadQuaternion(array);
            this.LocalScale = MuBitConverter_1.default.ReadVector(array);
        }
        Serialize(data) {
            MuBitConverter_1.default.WriteString(data, this.Name);
            MuBitConverter_1.default.WriteVector(data, this.LocalPosition);
            MuBitConverter_1.default.WriteQuaternion(data, this.LocalRotation);
            MuBitConverter_1.default.WriteVector(data, this.LocalScale);
        }
    }
    exports.default = MuTransform;
});
//# sourceMappingURL=MuTransform.js.map