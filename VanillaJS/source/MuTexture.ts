class MuTexture {
    
    public Name: string;
    public Type: number;
    
    constructor (array: IMuBinary) {
        if ((window as any).muTSlog) { console.log (`Reading MuTexture @${array.offset}`) };
        
        this.Name = MuBitConverter.ReadString (array);
        this.Type = MuBitConverter.ReadInt (array);
    }
    
    public Serialize (data: number[]) {
        MuBitConverter.WriteString (data, this.Name);
        MuBitConverter.WriteInt (data, this.Type);
    }
    
}