var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./MuBitConverter"], function (require, exports, MuBitConverter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    MuBitConverter_1 = __importDefault(MuBitConverter_1);
    class MuMatTex {
        constructor(array) {
            this.Scale = [0, 0];
            this.Offset = [0, 0];
            if (window.muTSlog) {
                console.log(`Reading MuMatTex @${array.offset}`);
            }
            ;
            this.Index = MuBitConverter_1.default.ReadInt(array);
            this.Scale[0] = MuBitConverter_1.default.ReadFloat(array);
            this.Scale[1] = MuBitConverter_1.default.ReadFloat(array);
            this.Offset[0] = MuBitConverter_1.default.ReadFloat(array);
            this.Offset[1] = MuBitConverter_1.default.ReadFloat(array);
        }
        Serialize(data) {
            MuBitConverter_1.default.WriteInt(data, this.Index);
            MuBitConverter_1.default.WriteFloat(data, this.Scale[0]);
            MuBitConverter_1.default.WriteFloat(data, this.Scale[1]);
            MuBitConverter_1.default.WriteFloat(data, this.Offset[0]);
            MuBitConverter_1.default.WriteFloat(data, this.Offset[1]);
        }
    }
    exports.default = MuMatTex;
});
//# sourceMappingURL=MuMatTex.js.map