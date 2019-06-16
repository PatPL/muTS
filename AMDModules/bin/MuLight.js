var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./MuBitConverter", "./MuEnum"], function (require, exports, MuBitConverter_1, MuEnum_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    MuBitConverter_1 = __importDefault(MuBitConverter_1);
    class MuLight {
        constructor(array) {
            this.Color = [0, 0, 0, 0];
            this.SpotAngle = 0;
            if (window.muTSlog) {
                console.log(`Reading MuLight @${array.offset}`);
            }
            ;
            this.Type = MuBitConverter_1.default.ReadInt(array);
            this.Intensity = MuBitConverter_1.default.ReadFloat(array);
            this.Range = MuBitConverter_1.default.ReadFloat(array);
            this.Color[0] = MuBitConverter_1.default.ReadFloat(array);
            this.Color[1] = MuBitConverter_1.default.ReadFloat(array);
            this.Color[2] = MuBitConverter_1.default.ReadFloat(array);
            this.Color[3] = MuBitConverter_1.default.ReadFloat(array);
            this.CullingMask = MuBitConverter_1.default.ReadUInt(array);
            if (array.version > 1) {
                this.SpotAngle = MuBitConverter_1.default.ReadFloat(array);
            }
        }
        Serialize(data) {
            MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.ET_LIGHT);
            MuBitConverter_1.default.WriteInt(data, this.Type);
            MuBitConverter_1.default.WriteFloat(data, this.Intensity);
            MuBitConverter_1.default.WriteFloat(data, this.Range);
            MuBitConverter_1.default.WriteFloat(data, this.Color[0]);
            MuBitConverter_1.default.WriteFloat(data, this.Color[1]);
            MuBitConverter_1.default.WriteFloat(data, this.Color[2]);
            MuBitConverter_1.default.WriteFloat(data, this.Color[3]);
            MuBitConverter_1.default.WriteUInt(data, this.CullingMask);
            MuBitConverter_1.default.WriteFloat(data, this.SpotAngle);
        }
    }
    exports.default = MuLight;
});
//# sourceMappingURL=MuLight.js.map