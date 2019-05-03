var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "../MuBitConverter", "../MuMesh", "../MuEnum"], function (require, exports, MuBitConverter_1, MuMesh_1, MuEnum_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    MuBitConverter_1 = __importDefault(MuBitConverter_1);
    MuMesh_1 = __importDefault(MuMesh_1);
    class MuColliderMesh {
        constructor(array, isTwo) {
            this.IsTrigger = 0;
            this.HasTrigger = isTwo;
            if (this.HasTrigger) {
                this.IsTrigger = MuBitConverter_1.default.ReadByte(array);
            }
            this.Convex = MuBitConverter_1.default.ReadByte(array);
            this.Mesh = new MuMesh_1.default(array);
        }
        Serialize(data) {
            if (this.HasTrigger) {
                MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.ET_MESH_COLLIDER2);
                MuBitConverter_1.default.WriteByte(data, this.IsTrigger);
            }
            else {
                MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.ET_MESH_COLLIDER);
            }
            MuBitConverter_1.default.WriteByte(data, this.Convex);
            this.Mesh.Serialize(data);
        }
    }
    exports.default = MuColliderMesh;
});
//# sourceMappingURL=MuColliderMesh.js.map