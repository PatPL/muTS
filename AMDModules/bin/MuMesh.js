var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./MuBitConverter", "./MuEnum", "./MuBoneWeight"], function (require, exports, MuBitConverter_1, MuEnum_1, MuBoneWeight_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    MuBitConverter_1 = __importDefault(MuBitConverter_1);
    MuBoneWeight_1 = __importDefault(MuBoneWeight_1);
    class MuMesh {
        constructor(array) {
            this.Vertices = [];
            this.UVs = [];
            this.UV2s = [];
            this.Normals = [];
            this.Tangents = [];
            this.BoneWeights = [];
            this.BindPoses = [];
            this.Submeshes = [];
            this.Colors = [];
            let start = MuBitConverter_1.default.ReadInt(array);
            if (start != MuEnum_1.MuEnum.ET_MESH_START) {
                console.error("This shouldn't happen. Is the mu file corrupted?");
                throw `Unexpected value spotted @${array.offset}`;
            }
            let VerticleCount = MuBitConverter_1.default.ReadInt(array);
            let SubmeshCount = MuBitConverter_1.default.ReadInt(array);
            MeshLoop: while (true) {
                let Type = MuBitConverter_1.default.ReadInt(array);
                switch (Type) {
                    case MuEnum_1.MuEnum.ET_MESH_END:
                        break MeshLoop;
                    case MuEnum_1.MuEnum.ET_MESH_VERTS:
                        for (let i = 0; i < VerticleCount; ++i) {
                            this.Vertices.push(MuBitConverter_1.default.ReadVector(array));
                        }
                        break;
                    case MuEnum_1.MuEnum.ET_MESH_UV:
                        for (let i = 0; i < VerticleCount; ++i) {
                            let x = MuBitConverter_1.default.ReadFloat(array);
                            let y = MuBitConverter_1.default.ReadFloat(array);
                            this.UVs.push([x, y]);
                        }
                        break;
                    case MuEnum_1.MuEnum.ET_MESH_UV2:
                        for (let i = 0; i < VerticleCount; ++i) {
                            let x = MuBitConverter_1.default.ReadFloat(array);
                            let y = MuBitConverter_1.default.ReadFloat(array);
                            this.UV2s.push([x, y]);
                        }
                        break;
                    case MuEnum_1.MuEnum.ET_MESH_NORMALS:
                        for (let i = 0; i < VerticleCount; ++i) {
                            this.Normals.push(MuBitConverter_1.default.ReadVector(array));
                        }
                        break;
                    case MuEnum_1.MuEnum.ET_MESH_TANGENTS:
                        for (let i = 0; i < VerticleCount; ++i) {
                            this.Tangents.push(MuBitConverter_1.default.ReadTangent(array));
                        }
                        break;
                    case MuEnum_1.MuEnum.ET_MESH_BONE_WEIGHTS:
                        for (let i = 0; i < VerticleCount; ++i) {
                            this.BoneWeights.push(new MuBoneWeight_1.default(array));
                        }
                        break;
                    case MuEnum_1.MuEnum.ET_MESH_BIND_POSES:
                        for (let i = 0; i < VerticleCount; ++i) {
                            let pose = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                            for (let i = 0; i < 16; ++i) {
                                pose[i] = MuBitConverter_1.default.ReadFloat(array);
                            }
                            this.BindPoses.push(pose);
                        }
                        break;
                    case MuEnum_1.MuEnum.ET_MESH_TRIANGLES:
                        let TriangleCount = MuBitConverter_1.default.ReadInt(array);
                        let Triangles = [];
                        if (TriangleCount % 3 != 0) {
                            console.warn("Is this guaranteed?");
                        }
                        for (let i = 0; i < TriangleCount / 3; ++i) {
                            let x = MuBitConverter_1.default.ReadInt(array);
                            let y = MuBitConverter_1.default.ReadInt(array);
                            let z = MuBitConverter_1.default.ReadInt(array);
                            if (x == 0) {
                                Triangles.push([x, z, y]);
                            }
                            else {
                                Triangles.push([z, y, x]);
                            }
                        }
                        this.Submeshes.push(Triangles);
                        break;
                    case MuEnum_1.MuEnum.ET_MESH_VERTEX_COLORS:
                        for (let i = 0; i < VerticleCount; ++i) {
                            this.Colors.push(MuBitConverter_1.default.ReadColor(array));
                        }
                        break;
                    default:
                        throw `Incorrect mesh value type: ${Type} @${array.offset}`;
                }
            }
        }
        Serialize(data) {
            MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.ET_MESH_START);
            MuBitConverter_1.default.WriteInt(data, this.Vertices.length);
            MuBitConverter_1.default.WriteInt(data, this.Submeshes.length);
            MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.ET_MESH_VERTS);
            this.Vertices.forEach(v => {
                MuBitConverter_1.default.WriteVector(data, v);
            });
            if (this.Vertices.length == this.UVs.length) {
                MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.ET_MESH_UV);
                this.UVs.forEach(uv => {
                    MuBitConverter_1.default.WriteFloat(data, uv[0]);
                    MuBitConverter_1.default.WriteFloat(data, uv[1]);
                });
            }
            if (this.Vertices.length == this.UV2s.length) {
                MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.ET_MESH_UV2);
                this.UV2s.forEach(uv2 => {
                    MuBitConverter_1.default.WriteFloat(data, uv2[0]);
                    MuBitConverter_1.default.WriteFloat(data, uv2[1]);
                });
            }
            if (this.Vertices.length == this.Normals.length) {
                MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.ET_MESH_NORMALS);
                this.Normals.forEach(normal => {
                    MuBitConverter_1.default.WriteVector(data, normal);
                });
            }
            if (this.Vertices.length == this.Tangents.length) {
                MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.ET_MESH_TANGENTS);
                this.Tangents.forEach(tangent => {
                    MuBitConverter_1.default.WriteTangent(data, tangent);
                });
            }
            if (this.Vertices.length == this.BoneWeights.length) {
                MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.ET_MESH_BONE_WEIGHTS);
                this.BoneWeights.forEach(boneWeight => {
                    boneWeight.Serialize(data);
                });
            }
            if (this.BindPoses.length > 0) {
                MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.ET_MESH_BIND_POSES);
                MuBitConverter_1.default.WriteInt(data, this.BindPoses.length);
                this.BindPoses.forEach(pose => {
                    for (let i = 0; i < 16; ++i) {
                        MuBitConverter_1.default.WriteFloat(data, pose[i]);
                    }
                });
            }
            if (this.Vertices.length == this.Colors.length) {
                MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.ET_MESH_VERTEX_COLORS);
                this.Colors.forEach(color => {
                    MuBitConverter_1.default.WriteColor(data, color);
                });
            }
            this.Submeshes.forEach(submesh => {
                MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.ET_MESH_TRIANGLES);
                MuBitConverter_1.default.WriteInt(data, submesh.length * 3);
                submesh.forEach(triangle => {
                    let [x, z, y] = triangle;
                    MuBitConverter_1.default.WriteInt(data, x);
                    MuBitConverter_1.default.WriteInt(data, y);
                    MuBitConverter_1.default.WriteInt(data, z);
                });
            });
            MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.ET_MESH_END);
        }
    }
    exports.default = MuMesh;
});
//# sourceMappingURL=MuMesh.js.map