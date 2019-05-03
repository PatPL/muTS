import IMuBinary from "./IMuBinary";
import MuBitConverter from "./MuBitConverter";
import { MuEnum } from "./MuEnum";

export default class MuCamera {
    
    public ClearFlags: number;
    public BackgroundColor: [number, number, number, number] = [0, 0, 0, 0];
    public CullingMask: number;
    public Orthographic: number;
    public FOV: number;
    public Near: number; // Clipping plane distance
    public Far: number; // Clipping plane distance
    public Depth: number;
    
    constructor (array: IMuBinary) {
        this.ClearFlags = MuBitConverter.ReadInt (array);
        this.BackgroundColor[0] = MuBitConverter.ReadFloat (array);
        this.BackgroundColor[1] = MuBitConverter.ReadFloat (array);
        this.BackgroundColor[2] = MuBitConverter.ReadFloat (array);
        this.BackgroundColor[3] = MuBitConverter.ReadFloat (array);
        this.CullingMask = MuBitConverter.ReadUInt (array);
        this.Orthographic = MuBitConverter.ReadByte (array);
        this.FOV = MuBitConverter.ReadFloat (array);
        this.Near = MuBitConverter.ReadFloat (array);
        this.Far = MuBitConverter.ReadFloat (array);
        this.Depth = MuBitConverter.ReadFloat (array);
    }
    
    public Serialize (data: number[]) {
        MuBitConverter.WriteInt (data, MuEnum.ET_CAMERA);
        MuBitConverter.WriteInt (data, this.ClearFlags);
        MuBitConverter.WriteFloat (data, this.BackgroundColor[0]);
        MuBitConverter.WriteFloat (data, this.BackgroundColor[1]);
        MuBitConverter.WriteFloat (data, this.BackgroundColor[2]);
        MuBitConverter.WriteFloat (data, this.BackgroundColor[3]);
        MuBitConverter.WriteUInt (data, this.CullingMask);
        MuBitConverter.WriteByte (data, this.Orthographic);
        MuBitConverter.WriteFloat (data, this.FOV);
        MuBitConverter.WriteFloat (data, this.Near);
        MuBitConverter.WriteFloat (data, this.Far);
        MuBitConverter.WriteFloat (data, this.Depth);
    }
    
}