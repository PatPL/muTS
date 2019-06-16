import IMuBinary from "./IMuBinary";
import MuBitConverter from "./MuBitConverter";

export default class MuMatTex {
    
    public Index: number;
    public Scale: [number, number] = [0, 0];
    public Offset: [number, number] = [0, 0];
    
    constructor (array: IMuBinary) {
        if ((window as any).muTSlog) { console.log (`Reading MuMatTex @${array.offset}`) };
        
        this.Index = MuBitConverter.ReadInt (array);
        this.Scale[0] = MuBitConverter.ReadFloat (array);
        this.Scale[1] = MuBitConverter.ReadFloat (array);
        this.Offset[0] = MuBitConverter.ReadFloat (array);
        this.Offset[1] = MuBitConverter.ReadFloat (array);
    }
    
    public Serialize (data: number[]) {
        MuBitConverter.WriteInt (data, this.Index);
        MuBitConverter.WriteFloat (data, this.Scale[0]);
        MuBitConverter.WriteFloat (data, this.Scale[1]);
        MuBitConverter.WriteFloat (data, this.Offset[0]);
        MuBitConverter.WriteFloat (data, this.Offset[1]);
    }
    
}