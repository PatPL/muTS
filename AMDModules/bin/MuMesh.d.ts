import MuBoneWeight from "./MuBoneWeight";
import IMuBinary from "./IMuBinary";
export default class MuMesh {
    Vertices: [number, number, number][];
    UVs: [number, number][];
    UV2s: [number, number][];
    Normals: [number, number, number][];
    Tangents: [number, number, number, number][];
    BoneWeights: MuBoneWeight[];
    BindPoses: BindPose[];
    Submeshes: [number, number, number][][];
    Colors: [number, number, number, number][];
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
declare type BindPose = [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number];
export {};
//# sourceMappingURL=MuMesh.d.ts.map