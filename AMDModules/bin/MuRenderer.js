var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./MuBitConverter", "./MuEnum"], function (require, exports, MuBitConverter_1, MuEnum_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    MuBitConverter_1 = __importDefault(MuBitConverter_1);
    class MuRenderer {
        constructor(array) {
            this.CastShadows = 1;
            this.ReceiveShadows = 1;
            this.Materials = [];
            if (window.muTSlog) {
                console.log(`Reading MuRenderer @${array.offset}`);
            }
            ;
            if (array.version > 0) {
                this.CastShadows = MuBitConverter_1.default.ReadByte(array);
                this.ReceiveShadows = MuBitConverter_1.default.ReadByte(array);
            }
            let MaterialCount = MuBitConverter_1.default.ReadInt(array);
            for (let i = 0; i < MaterialCount; ++i) {
                this.Materials.push(MuBitConverter_1.default.ReadInt(array));
            }
        }
        Serialize(data) {
            MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.ET_MESH_RENDERER);
            MuBitConverter_1.default.WriteByte(data, this.CastShadows);
            MuBitConverter_1.default.WriteByte(data, this.ReceiveShadows);
            MuBitConverter_1.default.WriteInt(data, this.Materials.length);
            this.Materials.forEach(material => {
                MuBitConverter_1.default.WriteInt(data, material);
            });
        }
    }
    exports.default = MuRenderer;
});
//# sourceMappingURL=MuRenderer.js.map