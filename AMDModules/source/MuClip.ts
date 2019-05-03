import IMuBinary from "./IMuBinary";
import MuBitConverter from "./MuBitConverter";
import MuCurve from "./MuCurve";

export default class MuClip {
    
    public Curves: MuCurve[] = [];
    public Name: string;
    // lb = localBounds?
    public lbCenter: [number, number, number];
    public lbSize: [number, number, number];
    public WrapMode: number;
    
    constructor (array: IMuBinary) {
        this.Name = MuBitConverter.ReadString (array);
        this.lbCenter = MuBitConverter.ReadVector (array);
        this.lbSize = MuBitConverter.ReadVector (array);
        this.WrapMode = MuBitConverter.ReadInt (array);
        
        let CurveCount = MuBitConverter.ReadInt (array);
        for (let i = 0; i < CurveCount; ++i) {
            this.Curves.push (new MuCurve (array));
        }
    }
    
    public Serialize (data: number[]) {
        MuBitConverter.WriteString (data, this.Name);
        MuBitConverter.WriteVector (data, this.lbCenter);
        MuBitConverter.WriteVector (data, this.lbSize);
        MuBitConverter.WriteInt (data, this.WrapMode);
        MuBitConverter.WriteInt (data, this.Curves.length);
        this.Curves.forEach (curve => {
            curve.Serialize (data);
        });
    }
    
}