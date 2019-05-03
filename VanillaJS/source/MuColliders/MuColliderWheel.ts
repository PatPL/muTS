class MuColliderWheel {
    
    public Mass: number;
    public Radius: number;
    public SuspensionDistance: number;
    public Center: [number, number, number];
    public SuspensionSpring: MuSpring;
    public ForwardFriction: MuFriction;
    public SidewaysFriction: MuFriction;
    
    constructor (array: IMuBinary) {
        this.Mass = MuBitConverter.ReadFloat (array);
        this.Radius = MuBitConverter.ReadFloat (array);
        this.SuspensionDistance = MuBitConverter.ReadFloat (array);
        this.Center = MuBitConverter.ReadVector (array);
        this.SuspensionSpring = new MuSpring (array);
        this.ForwardFriction = new MuFriction (array);
        this.SidewaysFriction = new MuFriction (array);
    }
    
    public Serialize (data: number[]) {
        MuBitConverter.WriteInt (data, MuEnum.ET_WHEEL_COLLIDER);
        MuBitConverter.WriteFloat (data, this.Mass);
        MuBitConverter.WriteFloat (data, this.Radius);
        MuBitConverter.WriteFloat (data, this.SuspensionDistance);
        MuBitConverter.WriteVector (data, this.Center);
        this.SuspensionSpring.Serialize (data);
        this.ForwardFriction.Serialize (data);
        this.SidewaysFriction.Serialize (data);
    }
    
}