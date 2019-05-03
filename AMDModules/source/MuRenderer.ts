import IMuBinary from "./IMuBinary";
import MuBitConverter from "./MuBitConverter";
import { MuEnum } from "./MuEnum";

export default class MuRenderer {
    
    public CastShadows: number = 1;
    public ReceiveShadows: number = 1;
    public Materials: number[] = [];
    
    constructor (array: IMuBinary) {
        if (array.version > 0) {
            this.CastShadows = MuBitConverter.ReadByte (array);
            this.ReceiveShadows = MuBitConverter.ReadByte (array);
        }
        
        let MaterialCount = MuBitConverter.ReadInt (array);
        for (let i = 0; i < MaterialCount; ++i) {
            this.Materials.push (MuBitConverter.ReadInt (array));
        }
    }
    
    public Serialize (data: number[]) {
        MuBitConverter.WriteInt (data, MuEnum.ET_MESH_RENDERER);
        MuBitConverter.WriteByte (data, this.CastShadows);
        MuBitConverter.WriteByte (data, this.ReceiveShadows);
        MuBitConverter.WriteInt (data, this.Materials.length);
        this.Materials.forEach (material => {
            MuBitConverter.WriteInt (data, material);
        });
    }
    
}