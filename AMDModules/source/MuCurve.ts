import IMuBinary from "./IMuBinary";
import MuBitConverter from "./MuBitConverter";
import MuKey from "./MuKey";

export default class MuCurve {
    
    public Path: string;
    public Property: string;
    public Type: number;
    public WrapMode: [number, number] = [0, 0];
    public Keys: MuKey[] = [];
    
    constructor (array: IMuBinary) {
        if ((window as any).muTSlog) { console.log (`Reading MuCurve @${array.offset}`) };
        
        this.Path = MuBitConverter.ReadString (array);
        this.Property = MuBitConverter.ReadString (array);
        this.Type = MuBitConverter.ReadInt (array);
        this.WrapMode[0] = MuBitConverter.ReadInt (array);
        this.WrapMode[1] = MuBitConverter.ReadInt (array);
        
        let KeyCount = MuBitConverter.ReadInt (array);
        for (let i = 0; i < KeyCount; ++i) {
            this.Keys.push (new MuKey (array));
        }
    }
    
    public Serialize (data: number[]) {
        MuBitConverter.WriteString (data, this.Path);
        MuBitConverter.WriteString (data, this.Property);
        MuBitConverter.WriteInt (data, this.Type);
        MuBitConverter.WriteInt (data, this.WrapMode[0]);
        MuBitConverter.WriteInt (data, this.WrapMode[1]);
        MuBitConverter.WriteInt (data, this.Keys.length);
        this.Keys.forEach (key => {
            key.Serialize (data);
        });
    }
    
}