class MuColliderSphere {
    
    public HasTrigger: boolean;
    public IsTrigger: number = 0;
    public Radius: number;
    public Center: [number, number, number];
    
    constructor (array: IMuBinary, isTwo: boolean) {
        if ((window as any).muTSlog) { console.log (`Reading MuColliderSphere @${array.offset}`) };
        
        this.HasTrigger = isTwo;
        if (this.HasTrigger) {
            this.IsTrigger = MuBitConverter.ReadByte (array);
        }
        
        this.Radius = MuBitConverter.ReadFloat (array);
        this.Center = MuBitConverter.ReadVector (array);
    }
    
    public Serialize (data: number[]) {
        if (this.HasTrigger) {
            MuBitConverter.WriteInt (data, MuEnum.ET_SPHERE_COLLIDER2);
            MuBitConverter.WriteByte (data, this.IsTrigger);
        } else {
            MuBitConverter.WriteInt (data, MuEnum.ET_SPHERE_COLLIDER);
        }
        
        MuBitConverter.WriteFloat (data, this.Radius);
        MuBitConverter.WriteVector (data, this.Center);
    }
    
}