var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./MuBitConverter", "./MuEnum", "./MuObject"], function (require, exports, MuBitConverter_1, MuEnum_1, MuObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    MuBitConverter_1 = __importDefault(MuBitConverter_1);
    MuObject_1 = __importDefault(MuObject_1);
    class Mu {
        constructor(data) {
            let array = {
                data: data,
                offset: 0,
                version: 0
            };
            if (window.muTSlog) {
                console.log(`Reading Mu @${array.offset}`);
            }
            ;
            this.Magic = MuBitConverter_1.default.ReadInt(array);
            this.Version = MuBitConverter_1.default.ReadInt(array);
            array.version = this.Version;
            if (this.Magic != MuEnum_1.MuEnum.MODEL_BINARY) {
                throw `Incorrect magic value. Is this really a .mu file? @${array.offset}`;
            }
            else if (this.Version < 0) {
                throw `File version is lower than 0. Is the file corrupted? @${array.offset}`;
            }
            else if (this.Version > MuEnum_1.MuEnum.FILE_VERSION) {
                throw `File version (${this.Version}) is higher than the highest supported version (${MuEnum_1.MuEnum.FILE_VERSION}). @${array.offset}`;
            }
            this.Name = MuBitConverter_1.default.ReadString(array);
            this.Object = new MuObject_1.default(array);
        }
        Serialize() {
            let data = [];
            MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.MODEL_BINARY);
            MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.FILE_VERSION);
            MuBitConverter_1.default.WriteString(data, this.Name);
            this.Object.Serialize(data);
            return new Uint8Array(data);
        }
    }
    exports.default = Mu;
});
//# sourceMappingURL=Mu.js.map