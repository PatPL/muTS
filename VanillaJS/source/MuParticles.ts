class MuParticles {
    
    // I'll port             |                    
    // MuParticles           |  ('-') <-clueless  
    //-----------------------+--------------------
    //   @mu.py              |    oh god          
    //   MuParticles()<      |       oh fuck      
    //     (._.)   [F12]     |                    
    
    public Emit: number;
    public Shape: number;
    public Shape3D: [number, number, number];
    public Shape2D: [number, number] = [0, 0];
    public Shape1D: number;
    public Color: [number, number, number, number] = [0, 0, 0, 0];
    public UseWorldSpace: number;
    public Size: [number, number] = [0, 0]; // Min, Max
    public Energy: [number, number] = [0, 0]; // Min, Max
    public Emission: [number, number] = [0, 0]; // Min, Max
    public WorldVelocity: [number, number, number];
    public LocalVelocity: [number, number, number];
    public RandomVelocity: [number, number, number];
    public EmitterVelocityScale: number;
    public AngularVelocity: number;
    public RandomAngularVelocity: number;
    public RandomRotation: number;
    public DoesAnimateColor: number;
    // 5 tuples containing 4 numbers each
    public ColorAnimation: ColorAnimation = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]; // Init here, insert values in constructor
    public WorldRotationAxis: [number, number, number];
    public LocalRotationAxis: [number, number, number];
    public SizeGrow: number;
    public RandomForce: [number, number, number];
    public Force: [number, number, number];
    public Damping: number;
    public CastShadows: number;
    public ReceiveShadows: number;
    public LengthScale: number;
    public VelocityScale: number;
    public MaxParticleSize: number;
    public ParticleRenderMode: number;
    public UVAnimation: [number, number, number] = [0, 0, 0]; // XTile, YTile, Cycles
    public Count: number;
    
    constructor (array: IMuBinary) {
        if ((window as any).muTSlog) { console.log (`Reading MuParticles @${array.offset}`) };
        
        this.Emit = MuBitConverter.ReadByte (array);
        this.Shape = MuBitConverter.ReadInt (array);
        this.Shape3D = MuBitConverter.ReadVector (array);
        this.Shape2D[0] = MuBitConverter.ReadFloat (array);
        this.Shape2D[1] = MuBitConverter.ReadFloat (array);
        this.Shape1D = MuBitConverter.ReadFloat (array);
        this.Color[0] = MuBitConverter.ReadFloat (array);
        this.Color[1] = MuBitConverter.ReadFloat (array);
        this.Color[2] = MuBitConverter.ReadFloat (array);
        this.Color[3] = MuBitConverter.ReadFloat (array);
        this.UseWorldSpace = MuBitConverter.ReadByte (array);
        this.Size[0] = MuBitConverter.ReadFloat (array);
        this.Size[1] = MuBitConverter.ReadFloat (array);
        this.Energy[0] = MuBitConverter.ReadFloat (array);
        this.Energy[1] = MuBitConverter.ReadFloat (array);
        this.Emission[0] = MuBitConverter.ReadInt (array);
        this.Emission[1] = MuBitConverter.ReadInt (array);
        this.WorldVelocity = MuBitConverter.ReadVector (array);
        this.LocalVelocity = MuBitConverter.ReadVector (array);
        this.RandomVelocity = MuBitConverter.ReadVector (array);
        this.EmitterVelocityScale = MuBitConverter.ReadFloat (array);
        this.AngularVelocity = MuBitConverter.ReadFloat (array);
        this.RandomAngularVelocity = MuBitConverter.ReadFloat (array);
        this.RandomRotation = MuBitConverter.ReadByte (array);
        this.DoesAnimateColor = MuBitConverter.ReadByte (array);
        for (let i = 0; i < 5; ++i) {
            for (let j = 0; j < 4; ++j) {
                this.ColorAnimation[i][j] = MuBitConverter.ReadFloat (array);
            }
        }
        this.WorldRotationAxis = MuBitConverter.ReadVector (array);
        this.LocalRotationAxis = MuBitConverter.ReadVector (array);
        this.SizeGrow = MuBitConverter.ReadFloat (array);
        this.RandomForce = MuBitConverter.ReadVector (array);
        this.Force = MuBitConverter.ReadVector (array);
        this.Damping = MuBitConverter.ReadFloat (array);
        this.CastShadows = MuBitConverter.ReadByte (array);
        this.ReceiveShadows = MuBitConverter.ReadByte (array);
        this.LengthScale = MuBitConverter.ReadFloat (array);
        this.VelocityScale = MuBitConverter.ReadFloat (array);
        this.MaxParticleSize = MuBitConverter.ReadFloat (array);
        this.ParticleRenderMode = MuBitConverter.ReadInt (array);
        this.UVAnimation[0] = MuBitConverter.ReadInt (array);
        this.UVAnimation[1] = MuBitConverter.ReadInt (array);
        this.UVAnimation[2] = MuBitConverter.ReadInt (array);
        this.Count = MuBitConverter.ReadInt (array);
    }
    
    public Serialize (data: number[]) {
        MuBitConverter.WriteByte (data, this.Emit);
        MuBitConverter.WriteInt (data, this.Shape);
        MuBitConverter.WriteVector (data, this.Shape3D);
        MuBitConverter.WriteFloat (data, this.Shape2D[0]);
        MuBitConverter.WriteFloat (data, this.Shape2D[1]);
        MuBitConverter.WriteFloat (data, this.Shape1D);
        MuBitConverter.WriteFloat (data, this.Color[0]);
        MuBitConverter.WriteFloat (data, this.Color[1]);
        MuBitConverter.WriteFloat (data, this.Color[2]);
        MuBitConverter.WriteFloat (data, this.Color[3]);
        MuBitConverter.WriteByte (data, this.UseWorldSpace);
        MuBitConverter.WriteFloat (data, this.Size[0]);
        MuBitConverter.WriteFloat (data, this.Size[1]);
        MuBitConverter.WriteFloat (data, this.Energy[0]);
        MuBitConverter.WriteFloat (data, this.Energy[1]);
        MuBitConverter.WriteInt (data, this.Emission[0]);
        MuBitConverter.WriteInt (data, this.Emission[1]);
        MuBitConverter.WriteVector (data, this.WorldVelocity);
        MuBitConverter.WriteVector (data, this.LocalVelocity);
        MuBitConverter.WriteVector (data, this.RandomVelocity);
        MuBitConverter.WriteFloat (data, this.EmitterVelocityScale);
        MuBitConverter.WriteFloat (data, this.AngularVelocity);
        MuBitConverter.WriteFloat (data, this.RandomAngularVelocity);
        MuBitConverter.WriteByte (data, this.RandomRotation);
        MuBitConverter.WriteByte (data, this.DoesAnimateColor);
        this.ColorAnimation.forEach (color => {
            color.forEach (c => {
                MuBitConverter.WriteFloat (data, c);
            });
        });
        MuBitConverter.WriteVector (data, this.WorldRotationAxis);
        MuBitConverter.WriteVector (data, this.LocalRotationAxis);
        MuBitConverter.WriteFloat (data, this.SizeGrow);
        MuBitConverter.WriteVector (data, this.RandomForce);
        MuBitConverter.WriteVector (data, this.Force);
        MuBitConverter.WriteFloat (data, this.Damping);
        MuBitConverter.WriteByte (data, this.CastShadows);
        MuBitConverter.WriteByte (data, this.ReceiveShadows);
        MuBitConverter.WriteFloat (data, this.LengthScale);
        MuBitConverter.WriteFloat (data, this.VelocityScale);
        MuBitConverter.WriteFloat (data, this.MaxParticleSize);
        MuBitConverter.WriteInt (data, this.ParticleRenderMode);
        MuBitConverter.WriteInt (data, this.UVAnimation[0]);
        MuBitConverter.WriteInt (data, this.UVAnimation[1]);
        MuBitConverter.WriteInt (data, this.UVAnimation[2]);
        MuBitConverter.WriteInt (data, this.Count);
    }
        
}

type ColorAnimation = [
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number]
];