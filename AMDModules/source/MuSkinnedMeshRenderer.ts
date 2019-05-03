import IMuBinary from "./IMuBinary";
import MuBitConverter from "./MuBitConverter";
import MuMesh from "./MuMesh";
import { MuEnum } from "./MuEnum";

export default class MuSkinnedMeshRenderer {
    
    public Materials: number[] = [];
    public Bones: string[] = [];
    public Center: [number, number, number];
    public Size: [number, number, number];
    public Quality: number;
    public UpdateWhenOffscreen: number;
    public Mesh: MuMesh;
    
    constructor (array: IMuBinary) {
        let MaterialCount = MuBitConverter.ReadInt (array);
        for (let i = 0; i < MaterialCount; ++i) {
            this.Materials.push (MuBitConverter.ReadInt (array));
        }
        
        this.Center = MuBitConverter.ReadVector (array);
        this.Size = MuBitConverter.ReadVector (array);
        this.Quality = MuBitConverter.ReadInt (array);
        this.UpdateWhenOffscreen = MuBitConverter.ReadByte (array);
        
        let BoneCount = MuBitConverter.ReadInt (array);
        for (let i = 0; i < BoneCount; ++i) {
            this.Bones.push (MuBitConverter.ReadString (array));
        }
        
        this.Mesh = new MuMesh (array);
    }
    
    public Serialize (data: number[]) {
        MuBitConverter.WriteInt (data, MuEnum.ET_SKINNED_MESH_RENDERER);
        MuBitConverter.WriteInt (data, this.Materials.length);
        this.Materials.forEach (material => {
            MuBitConverter.WriteInt (data, material);
        });
        MuBitConverter.WriteVector (data, this.Center);
        MuBitConverter.WriteVector (data, this.Size);
        MuBitConverter.WriteInt (data, this.Quality);
        MuBitConverter.WriteByte (data, this.UpdateWhenOffscreen);
        MuBitConverter.WriteInt (data, this.Bones.length);
        this.Bones.forEach (bone => {
            MuBitConverter.WriteString (data, bone);
        });
        this.Mesh.Serialize (data);
    }
    
}