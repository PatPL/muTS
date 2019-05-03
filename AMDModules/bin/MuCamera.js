var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./MuBitConverter", "./MuEnum"], function (require, exports, MuBitConverter_1, MuEnum_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    MuBitConverter_1 = __importDefault(MuBitConverter_1);
    class MuCamera {
        constructor(array) {
            this.BackgroundColor = [0, 0, 0, 0];
            this.ClearFlags = MuBitConverter_1.default.ReadInt(array);
            this.BackgroundColor[0] = MuBitConverter_1.default.ReadFloat(array);
            this.BackgroundColor[1] = MuBitConverter_1.default.ReadFloat(array);
            this.BackgroundColor[2] = MuBitConverter_1.default.ReadFloat(array);
            this.BackgroundColor[3] = MuBitConverter_1.default.ReadFloat(array);
            this.CullingMask = MuBitConverter_1.default.ReadUInt(array);
            this.Orthographic = MuBitConverter_1.default.ReadByte(array);
            this.FOV = MuBitConverter_1.default.ReadFloat(array);
            this.Near = MuBitConverter_1.default.ReadFloat(array);
            this.Far = MuBitConverter_1.default.ReadFloat(array);
            this.Depth = MuBitConverter_1.default.ReadFloat(array);
        }
        Serialize(data) {
            MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.ET_CAMERA);
            MuBitConverter_1.default.WriteInt(data, this.ClearFlags);
            MuBitConverter_1.default.WriteFloat(data, this.BackgroundColor[0]);
            MuBitConverter_1.default.WriteFloat(data, this.BackgroundColor[1]);
            MuBitConverter_1.default.WriteFloat(data, this.BackgroundColor[2]);
            MuBitConverter_1.default.WriteFloat(data, this.BackgroundColor[3]);
            MuBitConverter_1.default.WriteUInt(data, this.CullingMask);
            MuBitConverter_1.default.WriteByte(data, this.Orthographic);
            MuBitConverter_1.default.WriteFloat(data, this.FOV);
            MuBitConverter_1.default.WriteFloat(data, this.Near);
            MuBitConverter_1.default.WriteFloat(data, this.Far);
            MuBitConverter_1.default.WriteFloat(data, this.Depth);
        }
    }
    exports.default = MuCamera;
});
//# sourceMappingURL=MuCamera.js.map