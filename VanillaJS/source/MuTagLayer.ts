class MuTagLayer {
    
    public Tag: string;
    public Layer: number;
    
    constructor (array: IMuBinary) {
        if ((window as any).muTSlog) { console.log (`Reading MuTagLayer @${array.offset}`) };
        
        this.Tag = MuBitConverter.ReadString (array);
        this.Layer = MuBitConverter.ReadInt (array);
    }
    
    Serialize (data: number[]) {
        MuBitConverter.WriteInt (data, MuEnum.ET_TAG_AND_LAYER);
        MuBitConverter.WriteString (data, this.Tag);
        MuBitConverter.WriteInt (data, this.Layer);
    }
    
}