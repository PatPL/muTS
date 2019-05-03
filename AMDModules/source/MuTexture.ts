import IMuBinary from "./IMuBinary";
import MuBitConverter from "./MuBitConverter";

export default class MuTexture {
    
    public Name: string;
    public Type: number;
    
    constructor (array: IMuBinary) {
        this.Name = MuBitConverter.ReadString (array);
        this.Type = MuBitConverter.ReadInt (array);
    }
    
    public Serialize (data: number[]) {
        MuBitConverter.WriteString (data, this.Name);
        MuBitConverter.WriteInt (data, this.Type);
    }
    
}