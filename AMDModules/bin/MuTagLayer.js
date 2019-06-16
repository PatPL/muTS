var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./MuBitConverter", "./MuEnum"], function (require, exports, MuBitConverter_1, MuEnum_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    MuBitConverter_1 = __importDefault(MuBitConverter_1);
    class MuTagLayer {
        constructor(array) {
            if (window.muTSlog) {
                console.log(`Reading MuTagLayer @${array.offset}`);
            }
            ;
            this.Tag = MuBitConverter_1.default.ReadString(array);
            this.Layer = MuBitConverter_1.default.ReadInt(array);
        }
        Serialize(data) {
            MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.ET_TAG_AND_LAYER);
            MuBitConverter_1.default.WriteString(data, this.Tag);
            MuBitConverter_1.default.WriteInt(data, this.Layer);
        }
    }
    exports.default = MuTagLayer;
});
//# sourceMappingURL=MuTagLayer.js.map