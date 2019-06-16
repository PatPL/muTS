var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./MuBitConverter"], function (require, exports, MuBitConverter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    MuBitConverter_1 = __importDefault(MuBitConverter_1);
    class MuTexture {
        constructor(array) {
            if (window.muTSlog) {
                console.log(`Reading MuTexture @${array.offset}`);
            }
            ;
            this.Name = MuBitConverter_1.default.ReadString(array);
            this.Type = MuBitConverter_1.default.ReadInt(array);
        }
        Serialize(data) {
            MuBitConverter_1.default.WriteString(data, this.Name);
            MuBitConverter_1.default.WriteInt(data, this.Type);
        }
    }
    exports.default = MuTexture;
});
//# sourceMappingURL=MuTexture.js.map