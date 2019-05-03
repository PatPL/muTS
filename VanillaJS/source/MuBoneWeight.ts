class MuBoneWeight {
    
    public Indices: [number, number, number, number];
    public Weights: [number, number, number, number];
    
    constructor (array: IMuBinary) {
        let I1 = MuBitConverter.ReadInt (array);
        let W1 = MuBitConverter.ReadFloat (array);
        let I2 = MuBitConverter.ReadInt (array);
        let W2 = MuBitConverter.ReadFloat (array);
        let I3 = MuBitConverter.ReadInt (array);
        let W3 = MuBitConverter.ReadFloat (array);
        let I4 = MuBitConverter.ReadInt (array);
        let W4 = MuBitConverter.ReadFloat (array);
        
        this.Indices = [I1, I2, I3, I4];
        this.Weights = [W1, W2, W3, W4];
    }
    
    public Serialize (data: number[]) {
        MuBitConverter.WriteInt (data, this.Indices[0]);
        MuBitConverter.WriteFloat (data, this.Weights[0]);
        MuBitConverter.WriteInt (data, this.Indices[1]);
        MuBitConverter.WriteFloat (data, this.Weights[1]);
        MuBitConverter.WriteInt (data, this.Indices[2]);
        MuBitConverter.WriteFloat (data, this.Weights[2]);
        MuBitConverter.WriteInt (data, this.Indices[3]);
        MuBitConverter.WriteFloat (data, this.Weights[3]);
    }
    
}