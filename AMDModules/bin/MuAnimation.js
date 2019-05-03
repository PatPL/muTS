var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./MuBitConverter", "./MuEnum", "./MuClip"], function (require, exports, MuBitConverter_1, MuEnum_1, MuClip_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    MuBitConverter_1 = __importDefault(MuBitConverter_1);
    MuClip_1 = __importDefault(MuClip_1);
    class MuAnimation {
        constructor(array) {
            this.Clips = [];
            let ClipCount = MuBitConverter_1.default.ReadInt(array);
            for (let i = 0; i < ClipCount; ++i) {
                this.Clips.push(new MuClip_1.default(array));
            }
            this.ClipName = MuBitConverter_1.default.ReadString(array);
            this.Autoplay = MuBitConverter_1.default.ReadByte(array);
        }
        Serialize(data) {
            MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.ET_ANIMATION);
            MuBitConverter_1.default.WriteInt(data, this.Clips.length);
            this.Clips.forEach(clip => {
                clip.Serialize(data);
            });
            MuBitConverter_1.default.WriteString(data, this.ClipName);
            MuBitConverter_1.default.WriteByte(data, this.Autoplay);
        }
    }
    exports.default = MuAnimation;
});
//# sourceMappingURL=MuAnimation.js.map