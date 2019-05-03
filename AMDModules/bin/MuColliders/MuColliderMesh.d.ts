import MuMesh from "../MuMesh";
import IMuBinary from "../IMuBinary";
export default class MuColliderMesh {
    HasTrigger: boolean;
    IsTrigger: number;
    Convex: number;
    Mesh: MuMesh;
    constructor(array: IMuBinary, isTwo: boolean);
    Serialize(data: number[]): void;
}
//# sourceMappingURL=MuColliderMesh.d.ts.map