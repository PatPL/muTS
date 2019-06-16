class MuLight {
    
    public Type: number;
    public Intensity: number;
    public Range: number;
    public Color: [number, number, number, number] = [0, 0, 0, 0];
    public CullingMask: number;
    public SpotAngle: number = 0;
    
    constructor (array: IMuBinary) {
        if ((window as any).muTSlog) { console.log (`Reading MuLight @${array.offset}`) };
        
        this.Type = MuBitConverter.ReadInt (array);
        this.Intensity = MuBitConverter.ReadFloat (array);
        this.Range = MuBitConverter.ReadFloat (array);
        this.Color[0] = MuBitConverter.ReadFloat (array);
        this.Color[1] = MuBitConverter.ReadFloat (array);
        this.Color[2] = MuBitConverter.ReadFloat (array);
        this.Color[3] = MuBitConverter.ReadFloat (array);
        this.CullingMask = MuBitConverter.ReadUInt (array);
        if (array.version > 1) {
            this.SpotAngle = MuBitConverter.ReadFloat (array);
        }
    }
    
    public Serialize (data: number[]) {
        MuBitConverter.WriteInt (data, MuEnum.ET_LIGHT);
        MuBitConverter.WriteInt (data, this.Type);
        MuBitConverter.WriteFloat (data, this.Intensity);
        MuBitConverter.WriteFloat (data, this.Range);
        MuBitConverter.WriteFloat (data, this.Color[0]);
        MuBitConverter.WriteFloat (data, this.Color[1]);
        MuBitConverter.WriteFloat (data, this.Color[2]);
        MuBitConverter.WriteFloat (data, this.Color[3]);
        MuBitConverter.WriteUInt (data, this.CullingMask);
        MuBitConverter.WriteFloat (data, this.SpotAngle);
    }
    
}