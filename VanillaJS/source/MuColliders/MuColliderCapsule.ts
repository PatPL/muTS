class MuColliderCapsule {
    
    public HasTrigger: boolean;
    public IsTrigger: number = 0;
    public Radius: number;
    public Height: number;
    public Direction: number;
    public Center: [number, number, number];
    
    constructor (array: IMuBinary, isTwo: boolean) {
        this.HasTrigger = isTwo;
        if (this.HasTrigger) {
            this.IsTrigger = MuBitConverter.ReadByte (array);
        }
        
        this.Radius = MuBitConverter.ReadFloat (array);
        this.Height = MuBitConverter.ReadFloat (array);
        this.Direction = MuBitConverter.ReadInt (array);
        this.Center = MuBitConverter.ReadVector (array);
    }
    
    public Serialize (data: number[]) {
        if (this.HasTrigger) {
            MuBitConverter.WriteInt (data, MuEnum.ET_CAPSULE_COLLIDER2);
            MuBitConverter.WriteByte (data, this.IsTrigger);
        } else {
            MuBitConverter.WriteInt (data, MuEnum.ET_CAPSULE_COLLIDER);
        }
        
        MuBitConverter.WriteFloat (data, this.Radius);
        MuBitConverter.WriteFloat (data, this.Height);
        MuBitConverter.WriteInt (data, this.Direction);
        MuBitConverter.WriteVector (data, this.Center);
    }
    
}