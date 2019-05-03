import IMuBinary from "./IMuBinary";
import MuMesh from "./MuMesh";
export default class MuSkinnedMeshRenderer {
    Materials: number[];
    Bones: string[];
    Center: [number, number, number];
    Size: [number, number, number];
    Quality: number;
    UpdateWhenOffscreen: number;
    Mesh: MuMesh;
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
//# sourceMappingURL=MuSkinnedMeshRenderer.d.ts.map