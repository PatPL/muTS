class MuFriction {
    
    public ExtremumSlip: number;
    public ExtremumValue: number;
    public AsymptoteSlip: number;
    public AsymptoteValue: number;
    public Stiffness: number;
    
    constructor (array: IMuBinary) {
        this.ExtremumSlip = MuBitConverter.ReadFloat (array);
        this.ExtremumValue = MuBitConverter.ReadFloat (array);
        this.AsymptoteSlip = MuBitConverter.ReadFloat (array);
        this.AsymptoteValue = MuBitConverter.ReadFloat (array);
        this.Stiffness = MuBitConverter.ReadFloat (array);
    }
    
    public Serialize (data: number[]) {
        MuBitConverter.WriteFloat (data, this.ExtremumSlip);
        MuBitConverter.WriteFloat (data, this.ExtremumValue);
        MuBitConverter.WriteFloat (data, this.AsymptoteSlip);
        MuBitConverter.WriteFloat (data, this.AsymptoteValue);
        MuBitConverter.WriteFloat (data, this.Stiffness);
    }
    
}