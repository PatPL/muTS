class MuAnimation {
    
    public Clips: MuClip[] = [];
    public ClipName: string; // Not sure if it's the name, but I changed it to stand out more from the 'Clips'. Original name: 'Clip'
    public Autoplay: number;
    
    constructor (array: IMuBinary) {
        if ((window as any).muTSlog) { console.log (`Reading MuAnimation @${array.offset}`) };
        let ClipCount = MuBitConverter.ReadInt (array);
        for (let i = 0; i < ClipCount; ++i) {
            this.Clips.push (new MuClip (array));
        }
        
        this.ClipName = MuBitConverter.ReadString (array);
        this.Autoplay = MuBitConverter.ReadByte (array);
    }
    
    public Serialize (data: number[]) {
        MuBitConverter.WriteInt (data, MuEnum.ET_ANIMATION);
        MuBitConverter.WriteInt (data, this.Clips.length);
        this.Clips.forEach (clip => {
            clip.Serialize (data);
        });
        MuBitConverter.WriteString (data, this.ClipName);
        MuBitConverter.WriteByte (data, this.Autoplay);
    }
    
}