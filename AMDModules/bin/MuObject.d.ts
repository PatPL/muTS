import MuTransform from "./MuTransform";
import MuTagLayer from "./MuTagLayer";
import { MuCollider } from "./MuColliders/MuCollider";
import MuMesh from "./MuMesh";
import MuRenderer from "./MuRenderer";
import IMuBinary from "./IMuBinary";
import MuSkinnedMeshRenderer from "./MuSkinnedMeshRenderer";
import MuAnimation from "./MuAnimation";
import MuCamera from "./MuCamera";
import MuParticles from "./MuParticles";
import MuLight from "./MuLight";
import MuMaterial from "./MuMaterial";
import MuTexture from "./MuTexture";
export default class MuObject {
    Materials: MuMaterial[];
    Textures: MuTexture[];
    Children: MuObject[];
    Transform: MuTransform;
    TagAndLayer?: MuTagLayer;
    Collider?: MuCollider;
    SharedMesh?: MuMesh;
    Renderer?: MuRenderer;
    SkinnedMeshRenderer?: MuSkinnedMeshRenderer;
    Animation?: MuAnimation;
    Camera?: MuCamera;
    Particles?: MuParticles;
    Light?: MuLight;
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
//# sourceMappingURL=MuObject.d.ts.map