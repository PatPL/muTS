var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./MuBitConverter", "./MuKey"], function (require, exports, MuBitConverter_1, MuKey_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    MuBitConverter_1 = __importDefault(MuBitConverter_1);
    MuKey_1 = __importDefault(MuKey_1);
    class MuCurve {
        constructor(array) {
            this.WrapMode = [0, 0];
            this.Keys = [];
            if (window.muTSlog) {
                console.log(`Reading MuCurve @${array.offset}`);
            }
            ;
            this.Path = MuBitConverter_1.default.ReadString(array);
            this.Property = MuBitConverter_1.default.ReadString(array);
            this.Type = MuBitConverter_1.default.ReadInt(array);
            this.WrapMode[0] = MuBitConverter_1.default.ReadInt(array);
            this.WrapMode[1] = MuBitConverter_1.default.ReadInt(array);
            let KeyCount = MuBitConverter_1.default.ReadInt(array);
            for (let i = 0; i < KeyCount; ++i) {
                this.Keys.push(new MuKey_1.default(array));
            }
        }
        Serialize(data) {
            MuBitConverter_1.default.WriteString(data, this.Path);
            MuBitConverter_1.default.WriteString(data, this.Property);
            MuBitConverter_1.default.WriteInt(data, this.Type);
            MuBitConverter_1.default.WriteInt(data, this.WrapMode[0]);
            MuBitConverter_1.default.WriteInt(data, this.WrapMode[1]);
            MuBitConverter_1.default.WriteInt(data, this.Keys.length);
            this.Keys.forEach(key => {
                key.Serialize(data);
            });
        }
    }
    exports.default = MuCurve;
});
//# sourceMappingURL=MuCurve.js.map