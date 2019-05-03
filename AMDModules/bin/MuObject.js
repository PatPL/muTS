var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./MuTransform", "./MuBitConverter", "./MuEnum", "./MuTagLayer", "./MuColliders/MuCollider", "./MuMesh", "./MuRenderer", "./MuSkinnedMeshRenderer", "./MuAnimation", "./MuCamera", "./MuParticles", "./MuLight", "./MuMaterial", "./MuTexture"], function (require, exports, MuTransform_1, MuBitConverter_1, MuEnum_1, MuTagLayer_1, MuCollider_1, MuMesh_1, MuRenderer_1, MuSkinnedMeshRenderer_1, MuAnimation_1, MuCamera_1, MuParticles_1, MuLight_1, MuMaterial_1, MuTexture_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    MuTransform_1 = __importDefault(MuTransform_1);
    MuBitConverter_1 = __importDefault(MuBitConverter_1);
    MuTagLayer_1 = __importDefault(MuTagLayer_1);
    MuMesh_1 = __importDefault(MuMesh_1);
    MuRenderer_1 = __importDefault(MuRenderer_1);
    MuSkinnedMeshRenderer_1 = __importDefault(MuSkinnedMeshRenderer_1);
    MuAnimation_1 = __importDefault(MuAnimation_1);
    MuCamera_1 = __importDefault(MuCamera_1);
    MuParticles_1 = __importDefault(MuParticles_1);
    MuLight_1 = __importDefault(MuLight_1);
    MuMaterial_1 = __importDefault(MuMaterial_1);
    MuTexture_1 = __importDefault(MuTexture_1);
    class MuObject {
        constructor(array) {
            this.Materials = [];
            this.Textures = [];
            this.Children = [];
            this.Transform = new MuTransform_1.default(array);
            MainLoop: while (true) {
                let EntryType;
                try {
                    EntryType = MuBitConverter_1.default.ReadInt(array);
                }
                catch (e) {
                    break;
                }
                switch (EntryType) {
                    case MuEnum_1.MuEnum.ET_CHILD_TRANSFORM_START:
                        this.Children.push(new MuObject(array));
                        break;
                    case MuEnum_1.MuEnum.ET_CHILD_TRANSFORM_END:
                        break MainLoop;
                    case MuEnum_1.MuEnum.ET_TAG_AND_LAYER:
                        this.TagAndLayer = new MuTagLayer_1.default(array);
                        break;
                    case MuEnum_1.MuEnum.ET_MESH_COLLIDER:
                    case MuEnum_1.MuEnum.ET_MESH_COLLIDER2:
                    case MuEnum_1.MuEnum.ET_SPHERE_COLLIDER:
                    case MuEnum_1.MuEnum.ET_SPHERE_COLLIDER2:
                    case MuEnum_1.MuEnum.ET_CAPSULE_COLLIDER:
                    case MuEnum_1.MuEnum.ET_CAPSULE_COLLIDER2:
                    case MuEnum_1.MuEnum.ET_BOX_COLLIDER:
                    case MuEnum_1.MuEnum.ET_BOX_COLLIDER2:
                    case MuEnum_1.MuEnum.ET_WHEEL_COLLIDER:
                        this.Collider = MuCollider_1.MuCollider.GetCollider(array, EntryType);
                        break;
                    case MuEnum_1.MuEnum.ET_MESH_FILTER:
                        this.SharedMesh = new MuMesh_1.default(array);
                        break;
                    case MuEnum_1.MuEnum.ET_MESH_RENDERER:
                        this.Renderer = new MuRenderer_1.default(array);
                        break;
                    case MuEnum_1.MuEnum.ET_SKINNED_MESH_RENDERER:
                        this.SkinnedMeshRenderer = new MuSkinnedMeshRenderer_1.default(array);
                        break;
                    case MuEnum_1.MuEnum.ET_ANIMATION:
                        this.Animation = new MuAnimation_1.default(array);
                        break;
                    case MuEnum_1.MuEnum.ET_CAMERA:
                        this.Camera = new MuCamera_1.default(array);
                        break;
                    case MuEnum_1.MuEnum.ET_PARTICLES:
                        this.Particles = new MuParticles_1.default(array);
                        break;
                    case MuEnum_1.MuEnum.ET_LIGHT:
                        this.Light = new MuLight_1.default(array);
                        break;
                    case MuEnum_1.MuEnum.ET_MATERIALS:
                        let MaterialCount = MuBitConverter_1.default.ReadInt(array);
                        for (let i = 0; i < MaterialCount; ++i) {
                            this.Materials.push(new MuMaterial_1.default(array));
                        }
                        break;
                    case MuEnum_1.MuEnum.ET_TEXTURES:
                        let TextureCount = MuBitConverter_1.default.ReadInt(array);
                        for (let i = 0; i < TextureCount; ++i) {
                            this.Textures.push(new MuTexture_1.default(array));
                        }
                        break;
                    default:
                        console.warn(`Unknown entry type: ${EntryType} @${array.offset}`);
                        break;
                }
            }
        }
        Serialize(data) {
            this.Transform.Serialize(data);
            if (this.TagAndLayer) {
                this.TagAndLayer.Serialize(data);
            }
            else {
                console.error("Here");
                throw `Tag & Layer should always exist on a MU object`;
            }
            if (this.Collider) {
                this.Collider.Serialize(data);
            }
            if (this.SharedMesh) {
                MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.ET_MESH_FILTER);
                this.SharedMesh.Serialize(data);
            }
            if (this.Renderer) {
                this.Renderer.Serialize(data);
            }
            if (this.SkinnedMeshRenderer) {
                this.SkinnedMeshRenderer.Serialize(data);
            }
            if (this.Animation) {
                this.Animation.Serialize(data);
            }
            if (this.Camera) {
                this.Camera.Serialize(data);
            }
            if (this.Light) {
                this.Light.Serialize(data);
            }
            this.Children.forEach(child => {
                MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.ET_CHILD_TRANSFORM_START);
                child.Serialize(data);
                MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.ET_CHILD_TRANSFORM_END);
            });
            if (this.Materials.length > 0) {
                MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.ET_MATERIALS);
                MuBitConverter_1.default.WriteInt(data, this.Materials.length);
                this.Materials.forEach(material => {
                    material.Serialize(data);
                });
            }
            if (this.Textures.length > 0) {
                MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.ET_TEXTURES);
                MuBitConverter_1.default.WriteInt(data, this.Textures.length);
                this.Textures.forEach(texture => {
                    texture.Serialize(data);
                });
            }
        }
    }
    exports.default = MuObject;
});
//# sourceMappingURL=MuObject.js.map