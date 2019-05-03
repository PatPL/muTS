import MuBitConverter from "./MuBitConverter";
import { MuEnum } from "./MuEnum";
import IMuBinary from "./IMuBinary";

export default class MuTagLayer {
    
    public Tag: string;
    public Layer: number;
    
    constructor (array: IMuBinary) {
        this.Tag = MuBitConverter.ReadString (array);
        this.Layer = MuBitConverter.ReadInt (array);
    }
    
    Serialize (data: number[]) {
        MuBitConverter.WriteInt (data, MuEnum.ET_TAG_AND_LAYER);
        MuBitConverter.WriteString (data, this.Tag);
        MuBitConverter.WriteInt (data, this.Layer);
    }
    
}