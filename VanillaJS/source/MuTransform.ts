class MuTransform {
    
    public Name: string;
    public LocalPosition: [number, number, number];
    public LocalRotation: [number, number, number, number];
    public LocalScale: [number, number, number];
    
    constructor (array: IMuBinary) {
        if ((window as any).muTSlog) { console.log (`Reading MuTransform @${array.offset}`) };
        
        this.Name = MuBitConverter.ReadString (array);
        this.LocalPosition = MuBitConverter.ReadVector (array);
        this.LocalRotation = MuBitConverter.ReadQuaternion (array);
        this.LocalScale = MuBitConverter.ReadVector (array);
    }
    
    public Serialize (data: number[]) {
        MuBitConverter.WriteString (data, this.Name);
        MuBitConverter.WriteVector (data, this.LocalPosition);
        MuBitConverter.WriteQuaternion (data, this.LocalRotation);
        MuBitConverter.WriteVector (data, this.LocalScale);
    }
    
}