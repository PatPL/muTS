import MuTransform from "./MuTransform";
import MuBitConverter from "./MuBitConverter";
import { MuEnum } from "./MuEnum";
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
    
    public Materials: MuMaterial[] = [];
    public Textures: MuTexture[] = [];
    public Children: MuObject[] = [];
    
    public Transform: MuTransform;
    public TagAndLayer?: MuTagLayer;
    public Collider?: MuCollider;
    public SharedMesh?: MuMesh;
    public Renderer?: MuRenderer;
    public SkinnedMeshRenderer?: MuSkinnedMeshRenderer;
    public Animation?: MuAnimation;
    public Camera?: MuCamera;
    public Particles?: MuParticles;
    public Light?: MuLight;
    
    constructor (array: IMuBinary) {
        if ((window as any).muTSlog) { console.log (`Reading MuObject @${array.offset}`) };
        
        this.Transform = new MuTransform (array);
        
        // This loops till data ends
        MainLoop:
        while (true) {
            let EntryType: number;
            try {
                EntryType = MuBitConverter.ReadInt (array);
            } catch (e) {
                // Reading the type threw EOF, so there is no more data to read
                break;
            }
            
            switch (EntryType) {
                case MuEnum.ET_CHILD_TRANSFORM_START:
                this.Children.push (new MuObject (array));
                break;
                
                case MuEnum.ET_CHILD_TRANSFORM_END:
                // Current MuObject was a child of another MuObject, and this is where it ends
                // Breaks not the switch, but the while loop
                break MainLoop;
                
                case MuEnum.ET_TAG_AND_LAYER:
                this.TagAndLayer = new MuTagLayer (array);
                break;
                
                case MuEnum.ET_MESH_COLLIDER:
                case MuEnum.ET_MESH_COLLIDER2:
                case MuEnum.ET_SPHERE_COLLIDER:
                case MuEnum.ET_SPHERE_COLLIDER2:
                case MuEnum.ET_CAPSULE_COLLIDER:
                case MuEnum.ET_CAPSULE_COLLIDER2:
                case MuEnum.ET_BOX_COLLIDER:
                case MuEnum.ET_BOX_COLLIDER2:
                case MuEnum.ET_WHEEL_COLLIDER:
                this.Collider = MuCollider.GetCollider (array, EntryType);
                break;
                
                case MuEnum.ET_MESH_FILTER:
                this.SharedMesh = new MuMesh (array);
                break;
                
                case MuEnum.ET_MESH_RENDERER:
                this.Renderer = new MuRenderer (array);
                break;
                
                case MuEnum.ET_SKINNED_MESH_RENDERER:
                this.SkinnedMeshRenderer = new MuSkinnedMeshRenderer (array);
                break;
                
                case MuEnum.ET_ANIMATION:
                this.Animation = new MuAnimation (array);
                break;
                
                case MuEnum.ET_CAMERA:
                this.Camera = new MuCamera (array);
                break;
                
                case MuEnum.ET_PARTICLES:
                this.Particles = new MuParticles (array);
                break;
                
                case MuEnum.ET_LIGHT:
                this.Light = new MuLight (array);
                break;
                
                case MuEnum.ET_MATERIALS:
                let MaterialCount = MuBitConverter.ReadInt (array);
                for (let i = 0; i < MaterialCount; ++i) {
                    this.Materials.push (new MuMaterial (array));
                }
                break;
                
                case MuEnum.ET_TEXTURES:
                let TextureCount = MuBitConverter.ReadInt (array);
                for (let i = 0; i < TextureCount; ++i) {
                    this.Textures.push (new MuTexture (array));
                }
                break;
                
                default:
                console.warn (`Unknown entry type: ${EntryType} @${array.offset}`);
                break;
            }
        }
    }
    
    public Serialize (data: number[]) {
        this.Transform.Serialize (data);
        if (this.TagAndLayer) {
            this.TagAndLayer!.Serialize (data); // According to original code, this will always exist
        } else {
            console.error ("Here");
            throw `Tag & Layer should always exist on a MU object`;
        }
        
        if (this.Collider) {
            this.Collider.Serialize (data);
        }
        
        if (this.SharedMesh) {
            MuBitConverter.WriteInt (data, MuEnum.ET_MESH_FILTER);
            this.SharedMesh.Serialize (data);
        }
        
        if (this.Renderer) {
            this.Renderer.Serialize (data);
        }
        
        if (this.SkinnedMeshRenderer) {
            this.SkinnedMeshRenderer.Serialize (data);
        }
        
        if (this.Animation) {
            this.Animation.Serialize (data);
        }
        
        if (this.Camera) {
            this.Camera.Serialize (data);
        }
        
        if (this.Light) {
            this.Light.Serialize (data);
        }
        
        this.Children.forEach (child => {
            MuBitConverter.WriteInt (data, MuEnum.ET_CHILD_TRANSFORM_START);
            child.Serialize (data);
            MuBitConverter.WriteInt (data, MuEnum.ET_CHILD_TRANSFORM_END);
        });
        
        if (this.Materials.length > 0) {
            MuBitConverter.WriteInt (data, MuEnum.ET_MATERIALS);
            MuBitConverter.WriteInt (data, this.Materials.length);
            this.Materials.forEach (material => {
                material.Serialize (data);
            });
        }
        
        if (this.Textures.length > 0) {
            MuBitConverter.WriteInt (data, MuEnum.ET_TEXTURES);
            MuBitConverter.WriteInt (data, this.Textures.length);
            this.Textures.forEach (texture => {
                texture.Serialize (data);
            });
        }
        
    }
    
}