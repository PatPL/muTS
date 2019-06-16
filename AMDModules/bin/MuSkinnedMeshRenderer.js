var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./MuBitConverter", "./MuMesh", "./MuEnum"], function (require, exports, MuBitConverter_1, MuMesh_1, MuEnum_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    MuBitConverter_1 = __importDefault(MuBitConverter_1);
    MuMesh_1 = __importDefault(MuMesh_1);
    class MuSkinnedMeshRenderer {
        constructor(array) {
            this.Materials = [];
            this.Bones = [];
            if (window.muTSlog) {
                console.log(`Reading MuSkinnedMeshRenderer @${array.offset}`);
            }
            ;
            let MaterialCount = MuBitConverter_1.default.ReadInt(array);
            for (let i = 0; i < MaterialCount; ++i) {
                this.Materials.push(MuBitConverter_1.default.ReadInt(array));
            }
            this.Center = MuBitConverter_1.default.ReadVector(array);
            this.Size = MuBitConverter_1.default.ReadVector(array);
            this.Quality = MuBitConverter_1.default.ReadInt(array);
            this.UpdateWhenOffscreen = MuBitConverter_1.default.ReadByte(array);
            let BoneCount = MuBitConverter_1.default.ReadInt(array);
            for (let i = 0; i < BoneCount; ++i) {
                this.Bones.push(MuBitConverter_1.default.ReadString(array));
            }
            this.Mesh = new MuMesh_1.default(array);
        }
        Serialize(data) {
            MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.ET_SKINNED_MESH_RENDERER);
            MuBitConverter_1.default.WriteInt(data, this.Materials.length);
            this.Materials.forEach(material => {
                MuBitConverter_1.default.WriteInt(data, material);
            });
            MuBitConverter_1.default.WriteVector(data, this.Center);
            MuBitConverter_1.default.WriteVector(data, this.Size);
            MuBitConverter_1.default.WriteInt(data, this.Quality);
            MuBitConverter_1.default.WriteByte(data, this.UpdateWhenOffscreen);
            MuBitConverter_1.default.WriteInt(data, this.Bones.length);
            this.Bones.forEach(bone => {
                MuBitConverter_1.default.WriteString(data, bone);
            });
            this.Mesh.Serialize(data);
        }
    }
    exports.default = MuSkinnedMeshRenderer;
});
//# sourceMappingURL=MuSkinnedMeshRenderer.js.map