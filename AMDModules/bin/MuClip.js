var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./MuBitConverter", "./MuCurve"], function (require, exports, MuBitConverter_1, MuCurve_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    MuBitConverter_1 = __importDefault(MuBitConverter_1);
    MuCurve_1 = __importDefault(MuCurve_1);
    class MuClip {
        constructor(array) {
            this.Curves = [];
            if (window.muTSlog) {
                console.log(`Reading MuClip @${array.offset}`);
            }
            ;
            this.Name = MuBitConverter_1.default.ReadString(array);
            this.lbCenter = MuBitConverter_1.default.ReadVector(array);
            this.lbSize = MuBitConverter_1.default.ReadVector(array);
            this.WrapMode = MuBitConverter_1.default.ReadInt(array);
            let CurveCount = MuBitConverter_1.default.ReadInt(array);
            for (let i = 0; i < CurveCount; ++i) {
                this.Curves.push(new MuCurve_1.default(array));
            }
        }
        Serialize(data) {
            MuBitConverter_1.default.WriteString(data, this.Name);
            MuBitConverter_1.default.WriteVector(data, this.lbCenter);
            MuBitConverter_1.default.WriteVector(data, this.lbSize);
            MuBitConverter_1.default.WriteInt(data, this.WrapMode);
            MuBitConverter_1.default.WriteInt(data, this.Curves.length);
            this.Curves.forEach(curve => {
                curve.Serialize(data);
            });
        }
    }
    exports.default = MuClip;
});
//# sourceMappingURL=MuClip.js.map