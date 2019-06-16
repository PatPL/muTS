class MuColliderBox {
    
    public HasTrigger: boolean;
    public IsTrigger: number = 0;
    public Size: [number, number, number];
    public Center: [number, number, number];
    
    constructor (array: IMuBinary, isTwo: boolean) {
        if ((window as any).muTSlog) { console.log (`Reading MuColliderBox @${array.offset}`) };
        
        this.HasTrigger = isTwo;
        if (this.HasTrigger) {
            this.IsTrigger = MuBitConverter.ReadByte (array);
        }
        
        this.Size = MuBitConverter.ReadVector (array);
        this.Center = MuBitConverter.ReadVector (array);
    }
    
    public Serialize (data: number[]) {
        if (this.HasTrigger) {
            MuBitConverter.WriteInt (data, MuEnum.ET_BOX_COLLIDER2);
            MuBitConverter.WriteByte (data, this.IsTrigger);
        } else {
            MuBitConverter.WriteInt (data, MuEnum.ET_BOX_COLLIDER);
        }
        
        MuBitConverter.WriteVector (data, this.Size);
        MuBitConverter.WriteVector (data, this.Center);
    }
    
}