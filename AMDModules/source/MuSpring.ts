import MuBitConverter from "./MuBitConverter";
import IMuBinary from "./IMuBinary";

export default class MuSpring {
    
    public Spring: number;
    public Damper: number;
    public TargetPosition: number;
    
    constructor (array: IMuBinary) {
        if ((window as any).muTSlog) { console.log (`Reading MuSpring @${array.offset}`) };
        
        this.Spring = MuBitConverter.ReadFloat (array);
        this.Damper = MuBitConverter.ReadFloat (array);
        this.TargetPosition = MuBitConverter.ReadFloat (array);
    }
    
    public Serialize (data: number[]) {
        MuBitConverter.WriteFloat (data, this.Spring);
        MuBitConverter.WriteFloat (data, this.Damper);
        MuBitConverter.WriteFloat (data, this.TargetPosition);
    }
    
}