import MuBitConverter from "./MuBitConverter";
import { MuEnum } from "./MuEnum";
import MuObject from "./MuObject";
import IMuBinary from "./IMuBinary";

export default class Mu {
    
    public Magic: number;
    public Version: number;
    public Name: string;
    public Object: MuObject;
    
    constructor (data: Uint8Array) {
        let array: IMuBinary = {
            data: data,
            offset: 0,
            version: 0 // This is needed later in some mu elements
        }; //Prepare the object for reading array and keeping track of current offset
        
        this.Magic = MuBitConverter.ReadInt (array);
        this.Version = MuBitConverter.ReadInt (array);
        array.version = this.Version; // Update the version in the object
        
        if (
            this.Magic != MuEnum.MODEL_BINARY ||
            this.Version < 0 ||
            this.Version > MuEnum.FILE_VERSION
        ) {
            throw `Errors found in mu file @${array.offset}`;
        }
        
        this.Name = MuBitConverter.ReadString (array);
        
        this.Object = new MuObject (array);
    }
    
    public Serialize (): Uint8Array {
        // Other methods dump binary data into this array
        let data: number[] = [];
        
        MuBitConverter.WriteInt (data, MuEnum.MODEL_BINARY);
        MuBitConverter.WriteInt (data, MuEnum.FILE_VERSION);
        
        MuBitConverter.WriteString (data, this.Name);
        this.Object.Serialize (data);
        
        return new Uint8Array (data);
    }
    
}