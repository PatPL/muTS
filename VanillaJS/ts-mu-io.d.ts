interface IMuBinary {
    data: Uint8Array;
    offset: number;
    version: number;
}
declare class Mu {
    Magic: number;
    Version: number;
    Name: string;
    Object: MuObject;
    constructor(data: Uint8Array);
    Serialize(): Uint8Array;
}
declare class MuAnimation {
    Clips: MuClip[];
    ClipName: string;
    Autoplay: number;
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
declare class MuBitConverter {
    static ReadByte(array: IMuBinary): number;
    static ReadInt(array: IMuBinary): number;
    static Read7Int(array: IMuBinary): number;
    static ReadUInt(array: IMuBinary): number;
    static ReadFloat(array: IMuBinary): number;
    static ReadVector(array: IMuBinary): [number, number, number];
    static ReadQuaternion(array: IMuBinary): [number, number, number, number];
    static ReadTangent(array: IMuBinary): [number, number, number, number];
    static ReadColor(array: IMuBinary): [number, number, number, number];
    static ReadBytes(array: IMuBinary, length: number): Uint8Array;
    static ReadString(array: IMuBinary): string;
    static WriteByte(data: number[], value: number): void;
    static WriteInt(data: number[], value: number): void;
    static Write7Int(data: number[], value: number): void;
    static WriteUInt(data: number[], value: number): void;
    static WriteFloat(data: number[], value: number): void;
    static WriteVector(data: number[], value: [number, number, number]): void;
    static WriteQuaternion(data: number[], value: [number, number, number, number]): void;
    static WriteTangent(data: number[], value: [number, number, number, number]): void;
    static WriteColor(data: number[], value: [number, number, number, number]): void;
    static WriteBytes(data: number[], value: Uint8Array): void;
    static WriteString(data: number[], value: string): void;
}
declare class MuBoneWeight {
    Indices: [number, number, number, number];
    Weights: [number, number, number, number];
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
declare class MuCamera {
    ClearFlags: number;
    BackgroundColor: [number, number, number, number];
    CullingMask: number;
    Orthographic: number;
    FOV: number;
    Near: number;
    Far: number;
    Depth: number;
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
declare class MuClip {
    Curves: MuCurve[];
    Name: string;
    lbCenter: [number, number, number];
    lbSize: [number, number, number];
    WrapMode: number;
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
declare class MuCurve {
    Path: string;
    Property: string;
    Type: number;
    WrapMode: [number, number];
    Keys: MuKey[];
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
declare enum MuEnum {
    MODEL_BINARY = 76543,
    FILE_VERSION = 5,
    ET_CHILD_TRANSFORM_START = 0,
    ET_CHILD_TRANSFORM_END = 1,
    ET_ANIMATION = 2,
    ET_MESH_COLLIDER = 3,
    ET_SPHERE_COLLIDER = 4,
    ET_CAPSULE_COLLIDER = 5,
    ET_BOX_COLLIDER = 6,
    ET_MESH_FILTER = 7,
    ET_MESH_RENDERER = 8,
    ET_SKINNED_MESH_RENDERER = 9,
    ET_MATERIALS = 10,
    ET_MATERIAL = 11,
    ET_TEXTURES = 12,
    ET_MESH_START = 13,
    ET_MESH_VERTS = 14,
    ET_MESH_UV = 15,
    ET_MESH_UV2 = 16,
    ET_MESH_NORMALS = 17,
    ET_MESH_TANGENTS = 18,
    ET_MESH_TRIANGLES = 19,
    ET_MESH_BONE_WEIGHTS = 20,
    ET_MESH_BIND_POSES = 21,
    ET_MESH_END = 22,
    ET_LIGHT = 23,
    ET_TAG_AND_LAYER = 24,
    ET_MESH_COLLIDER2 = 25,
    ET_SPHERE_COLLIDER2 = 26,
    ET_CAPSULE_COLLIDER2 = 27,
    ET_BOX_COLLIDER2 = 28,
    ET_WHEEL_COLLIDER = 29,
    ET_CAMERA = 30,
    ET_PARTICLES = 31,
    ET_MESH_VERTEX_COLORS = 32,
    ST_CUSTOM = 0,
    ST_DIFFUSE = 1,
    ST_SPECULAR = 2,
    ST_BUMPED = 3,
    ST_BUMPED_SPECULAR = 4,
    ST_EMISSIVE = 5,
    ST_EMISSIVE_SPECULAR = 6,
    ST_EMISSIVE_BUMPED_SPECULAR = 7,
    ST_ALPHA_CUTOFF = 8,
    ST_ALPHA_CUTOFF_BUMPED = 9,
    ST_ALPHA = 10,
    ST_ALPHA_SPECULAR = 11,
    ST_ALPHA_UNLIT = 12,
    ST_UNLIT = 13,
    ST_PARTICLES_ALPHA_BLENDED = 14,
    ST_PARTICLES_ADDITIVE = 15,
    AT_TRANSFORM = 0,
    AT_MATERIAL = 1,
    AT_LIGHT = 2,
    AT_AUDIO_SOURCE = 3,
    TT_TEXTURE = 0,
    TT_NORMAL_MAP = 1,
    PT_COLOR_PROPERTY = 0,
    PT_VECTOR_PROPERTY = 1,
    PT_FLOAT_PROPERTY_2 = 2,
    PT_FLOAT_PROPERTY_3 = 3,
    PT_TEXTURE_PROPERTY = 4
}
declare class MuFriction {
    ExtremumSlip: number;
    ExtremumValue: number;
    AsymptoteSlip: number;
    AsymptoteValue: number;
    Stiffness: number;
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
declare class MuKey {
    Time: number;
    Value: number;
    Tangent: [number, number];
    TangentMode: number;
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
declare class MuLight {
    Type: number;
    Intensity: number;
    Range: number;
    Color: [number, number, number, number];
    CullingMask: number;
    SpotAngle: number;
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
declare class MuMatTex {
    Index: number;
    Scale: [number, number];
    Offset: [number, number];
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
declare class MuMaterial {
    static readonly ShaderNames: string[];
    ColorProperties: {
        [property: string]: [number, number, number, number];
    };
    VectorProperties: {
        [property: string]: [number, number, number, number];
    };
    FloatProperties2: {
        [property: string]: number;
    };
    FloatProperties3: {
        [property: string]: number;
    };
    TextureProperties: {
        [property: string]: MuMatTex;
    };
    Name: string;
    ShaderName: string;
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
declare type BindPose = [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number];
declare class MuMesh {
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
declare class MuObject {
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
declare type ColorAnimation = [[number, number, number, number], [number, number, number, number], [number, number, number, number], [number, number, number, number], [number, number, number, number]];
declare class MuParticles {
    Emit: number;
    Shape: number;
    Shape3D: [number, number, number];
    Shape2D: [number, number];
    Shape1D: number;
    Color: [number, number, number, number];
    UseWorldSpace: number;
    Size: [number, number];
    Energy: [number, number];
    Emission: [number, number];
    WorldVelocity: [number, number, number];
    LocalVelocity: [number, number, number];
    RandomVelocity: [number, number, number];
    EmitterVelocityScale: number;
    AngularVelocity: number;
    RandomAngularVelocity: number;
    RandomRotation: number;
    DoesAnimateColor: number;
    ColorAnimation: ColorAnimation;
    WorldRotationAxis: [number, number, number];
    LocalRotationAxis: [number, number, number];
    SizeGrow: number;
    RandomForce: [number, number, number];
    Force: [number, number, number];
    Damping: number;
    CastShadows: number;
    ReceiveShadows: number;
    LengthScale: number;
    VelocityScale: number;
    MaxParticleSize: number;
    ParticleRenderMode: number;
    UVAnimation: [number, number, number];
    Count: number;
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
declare class MuRenderer {
    CastShadows: number;
    ReceiveShadows: number;
    Materials: number[];
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
declare class MuSkinnedMeshRenderer {
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
declare class MuSpring {
    Spring: number;
    Damper: number;
    TargetPosition: number;
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
declare class MuTagLayer {
    Tag: string;
    Layer: number;
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
declare class MuTexture {
    Name: string;
    Type: number;
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
declare class MuTransform {
    Name: string;
    LocalPosition: [number, number, number];
    LocalRotation: [number, number, number, number];
    LocalScale: [number, number, number];
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
declare class MuCollider {
    static GetCollider(array: IMuBinary, colliderType: number): MuCollider;
    Serialize(data: number[]): void;
}
declare class MuColliderBox {
    HasTrigger: boolean;
    IsTrigger: number;
    Size: [number, number, number];
    Center: [number, number, number];
    constructor(array: IMuBinary, isTwo: boolean);
    Serialize(data: number[]): void;
}
declare class MuColliderCapsule {
    HasTrigger: boolean;
    IsTrigger: number;
    Radius: number;
    Height: number;
    Direction: number;
    Center: [number, number, number];
    constructor(array: IMuBinary, isTwo: boolean);
    Serialize(data: number[]): void;
}
declare class MuColliderMesh {
    HasTrigger: boolean;
    IsTrigger: number;
    Convex: number;
    Mesh: MuMesh;
    constructor(array: IMuBinary, isTwo: boolean);
    Serialize(data: number[]): void;
}
declare class MuColliderSphere {
    HasTrigger: boolean;
    IsTrigger: number;
    Radius: number;
    Center: [number, number, number];
    constructor(array: IMuBinary, isTwo: boolean);
    Serialize(data: number[]): void;
}
declare class MuColliderWheel {
    Mass: number;
    Radius: number;
    SuspensionDistance: number;
    Center: [number, number, number];
    SuspensionSpring: MuSpring;
    ForwardFriction: MuFriction;
    SidewaysFriction: MuFriction;
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
//# sourceMappingURL=ts-mu-io.d.ts.map