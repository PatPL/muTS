class MuMaterial {
    
    public static readonly ShaderNames: string[] = [
        "",
        "KSP/Diffuse",
        "KSP/Specular",
        "KSP/Bumped",
        "KSP/Bumped Specular",
        "KSP/Emissive/Diffuse",
        "KSP/Emissive/Specular",
        "KSP/Emissive/Bumped Specular",
        "KSP/Alpha/Cutoff",
        "KSP/Alpha/Cutoff Bumped",
        "KSP/Alpha/Translucent",
        "KSP/Alpha/Translucent Specular",
        "KSP/Alpha/Unlit Transparent",
        "KSP/Unlit",
        "KSP/Particles/Alpha Blended",
        "KSP/Particles/Additive",
    ];
    
    public ColorProperties: { [property: string]: [number, number, number, number] } = {};
    public VectorProperties: { [property: string]: [number, number, number, number] } = {};
    public FloatProperties2: { [property: string]: number } = {};
    public FloatProperties3: { [property: string]: number } = {};
    public TextureProperties: { [property: string]: MuMatTex } = {};
    
    public Name: string;
    public ShaderName: string;
    
    constructor (array: IMuBinary) {
        if ((window as any).muTSlog) { console.log (`Reading MuMaterial @${array.offset}`) };
        
        if (array.version >= 4) {
            // Version 4+
            this.Name = MuBitConverter.ReadString (array);
            this.ShaderName = MuBitConverter.ReadString (array);
            let PropertyCount = MuBitConverter.ReadInt (array);
            for (let i = 0; i < PropertyCount; ++i) {
                let PropertyName = MuBitConverter.ReadString (array);
                let PropertyType = MuBitConverter.ReadInt (array); // BTW, I love how they create 7Int to save 2-3 bytes on string length headers, but use all 4 bytes everytime to save enum values everywhere.
                
                let r, g, b, a; // Temp variables for later
                switch (PropertyType) {
                    case MuEnum.PT_COLOR_PROPERTY:
                    r = MuBitConverter.ReadFloat (array);
                    g = MuBitConverter.ReadFloat (array);
                    b = MuBitConverter.ReadFloat (array);
                    a = MuBitConverter.ReadFloat (array);
                    this.ColorProperties[PropertyName] = [r, g, b, a];
                    break;
                    
                    case MuEnum.PT_VECTOR_PROPERTY:
                    r = MuBitConverter.ReadFloat (array);
                    g = MuBitConverter.ReadFloat (array);
                    b = MuBitConverter.ReadFloat (array);
                    a = MuBitConverter.ReadFloat (array);
                    this.VectorProperties[PropertyName] = [r, g, b, a];
                    break;
                    
                    case MuEnum.PT_FLOAT_PROPERTY_2:
                    this.FloatProperties2[PropertyName] = MuBitConverter.ReadFloat (array);
                    break;
                    
                    case MuEnum.PT_FLOAT_PROPERTY_3:
                    this.FloatProperties3[PropertyName] = MuBitConverter.ReadFloat (array);
                    break;
                    
                    case MuEnum.PT_TEXTURE_PROPERTY:
                    this.TextureProperties[PropertyName] = new MuMatTex (array);
                    break;
                    
                    default:
                    // Original code does nothing in case of unknown property type.
                    console.warn (`Invalid property type: ${PropertyType}. Skipping.`);
                    break;
                }
            }
        } else {
            // Version up to (including) 3
            this.Name = MuBitConverter.ReadString (array);
            let Type = MuBitConverter.ReadInt (array);
            this.ShaderName = MuMaterial.ShaderNames[Type];
            
            let r, g, b, a; // Temp variables for later
            switch (Type) {
                case MuEnum.ST_SPECULAR:
                this.TextureProperties["_MainTex"] = new MuMatTex (array);
                r = MuBitConverter.ReadFloat (array);
                g = MuBitConverter.ReadFloat (array);
                b = MuBitConverter.ReadFloat (array);
                a = MuBitConverter.ReadFloat (array);
                this.ColorProperties["_SpecColor"] = [r, g, b, a];
                this.FloatProperties3["_Shininess"] = MuBitConverter.ReadFloat (array);
                break;
                
                case MuEnum.ST_BUMPED:
                this.TextureProperties["_MainTex"] = new MuMatTex (array);
                this.TextureProperties["_BumpMap"] = new MuMatTex (array);
                break;
                
                case MuEnum.ST_BUMPED_SPECULAR:
                this.TextureProperties["_MainTex"] = new MuMatTex (array);
                this.TextureProperties["_BumpMap"] = new MuMatTex (array);
                r = MuBitConverter.ReadFloat (array);
                g = MuBitConverter.ReadFloat (array);
                b = MuBitConverter.ReadFloat (array);
                a = MuBitConverter.ReadFloat (array);
                this.ColorProperties["_SpecColor"] = [r, g, b, a];
                this.FloatProperties3["_Shininess"] = MuBitConverter.ReadFloat (array);
                break;
                
                case MuEnum.ST_EMISSIVE:
                this.TextureProperties["_MainTex"] = new MuMatTex (array);
                this.TextureProperties["_Emissive"] = new MuMatTex (array);
                r = MuBitConverter.ReadFloat (array);
                g = MuBitConverter.ReadFloat (array);
                b = MuBitConverter.ReadFloat (array);
                a = MuBitConverter.ReadFloat (array);
                this.ColorProperties["_EmissiveColor"] = [r, g, b, a];
                break;
                
                case MuEnum.ST_EMISSIVE_SPECULAR:
                this.TextureProperties["_MainTex"] = new MuMatTex (array);
                r = MuBitConverter.ReadFloat (array);
                g = MuBitConverter.ReadFloat (array);
                b = MuBitConverter.ReadFloat (array);
                a = MuBitConverter.ReadFloat (array);
                this.ColorProperties["_SpecColor"] = [r, g, b, a];
                this.FloatProperties3["_Shininess"] = MuBitConverter.ReadFloat (array);
                this.TextureProperties["_Emissive"] = new MuMatTex (array);
                r = MuBitConverter.ReadFloat (array);
                g = MuBitConverter.ReadFloat (array);
                b = MuBitConverter.ReadFloat (array);
                a = MuBitConverter.ReadFloat (array);
                this.ColorProperties["_EmissiveColor"] = [r, g, b, a];
                break;
                
                case MuEnum.ST_EMISSIVE_BUMPED_SPECULAR:
                this.TextureProperties["_MainTex"] = new MuMatTex (array);
                this.TextureProperties["_BumpMap"] = new MuMatTex (array);
                r = MuBitConverter.ReadFloat (array);
                g = MuBitConverter.ReadFloat (array);
                b = MuBitConverter.ReadFloat (array);
                a = MuBitConverter.ReadFloat (array);
                this.ColorProperties["_SpecColor"] = [r, g, b, a];
                this.FloatProperties3["_Shininess"] = MuBitConverter.ReadFloat (array);
                this.TextureProperties["_Emissive"] = new MuMatTex (array);
                r = MuBitConverter.ReadFloat (array);
                g = MuBitConverter.ReadFloat (array);
                b = MuBitConverter.ReadFloat (array);
                a = MuBitConverter.ReadFloat (array);
                this.ColorProperties["_EmissiveColor"] = [r, g, b, a];
                break;
                
                case MuEnum.ST_ALPHA_CUTOFF:
                this.TextureProperties["_MainTex"] = new MuMatTex (array);
                this.FloatProperties3["_Cutoff"] = MuBitConverter.ReadFloat (array);
                break;
                
                case MuEnum.ST_ALPHA_CUTOFF_BUMPED:
                this.TextureProperties["_MainTex"] = new MuMatTex (array);
                this.TextureProperties["_BumpMap"] = new MuMatTex (array);
                this.FloatProperties3["_Cutoff"] = MuBitConverter.ReadFloat (array);
                break;
                
                case MuEnum.ST_ALPHA:
                this.TextureProperties["_MainTex"] = new MuMatTex (array);
                break;
                
                case MuEnum.ST_ALPHA_SPECULAR:
                this.TextureProperties["_MainTex"] = new MuMatTex (array);
                this.FloatProperties3["_Gloss"] = MuBitConverter.ReadFloat (array); // Original comment on this one: #FIXME bogus
                r = MuBitConverter.ReadFloat (array);
                g = MuBitConverter.ReadFloat (array);
                b = MuBitConverter.ReadFloat (array);
                a = MuBitConverter.ReadFloat (array);
                this.ColorProperties["_SpecColor"] = [r, g, b, a];
                this.FloatProperties3["_Shininess"] = MuBitConverter.ReadFloat (array);
                break;
                
                case MuEnum.ST_ALPHA_UNLIT:
                case MuEnum.ST_UNLIT: //Both are the same in original code
                this.TextureProperties["_MainTex"] = new MuMatTex (array);
                r = MuBitConverter.ReadFloat (array);
                g = MuBitConverter.ReadFloat (array);
                b = MuBitConverter.ReadFloat (array);
                a = MuBitConverter.ReadFloat (array);
                this.ColorProperties["_Color"] = [r, g, b, a];
                break;
                
                case MuEnum.ST_PARTICLES_ALPHA_BLENDED:
                case MuEnum.ST_PARTICLES_ADDITIVE: //Both are the same in original code
                this.TextureProperties["_MainTex"] = new MuMatTex (array);
                r = MuBitConverter.ReadFloat (array);
                g = MuBitConverter.ReadFloat (array);
                b = MuBitConverter.ReadFloat (array);
                a = MuBitConverter.ReadFloat (array);
                this.ColorProperties["_Color"] = [r, g, b, a];
                this.FloatProperties3["_InvFade"] = MuBitConverter.ReadFloat (array);
                break;
                
                case MuEnum.ST_DIFFUSE:
                this.TextureProperties["_MainTex"] = new MuMatTex (array);
                break;
                
                default:
                throw `Unknown material type: ${Type} @${array.offset}`;
            }
        }
    }
    
    public Serialize (data: number[]) {
        let PropertyCount = Object.getOwnPropertyNames (this.ColorProperties).length;
        PropertyCount += Object.getOwnPropertyNames (this.VectorProperties).length;
        PropertyCount += Object.getOwnPropertyNames (this.FloatProperties2).length;
        PropertyCount += Object.getOwnPropertyNames (this.FloatProperties3).length;
        PropertyCount += Object.getOwnPropertyNames (this.TextureProperties).length;
        
        MuBitConverter.WriteString (data, this.Name);
        MuBitConverter.WriteString (data, this.ShaderName);
        MuBitConverter.WriteInt (data, PropertyCount);
        
        Object.getOwnPropertyNames (this.ColorProperties).forEach (prop => {
            MuBitConverter.WriteString (data, prop);
            MuBitConverter.WriteInt (data, MuEnum.PT_COLOR_PROPERTY);
            MuBitConverter.WriteFloat (data, this.ColorProperties[prop][0]);
            MuBitConverter.WriteFloat (data, this.ColorProperties[prop][1]);
            MuBitConverter.WriteFloat (data, this.ColorProperties[prop][2]);
            MuBitConverter.WriteFloat (data, this.ColorProperties[prop][3]);
        });
        
        Object.getOwnPropertyNames (this.VectorProperties).forEach (prop => {
            MuBitConverter.WriteString (data, prop);
            MuBitConverter.WriteInt (data, MuEnum.PT_VECTOR_PROPERTY);
            MuBitConverter.WriteFloat (data, this.VectorProperties[prop][0]);
            MuBitConverter.WriteFloat (data, this.VectorProperties[prop][1]);
            MuBitConverter.WriteFloat (data, this.VectorProperties[prop][2]);
            MuBitConverter.WriteFloat (data, this.VectorProperties[prop][3]);
        });
        
        Object.getOwnPropertyNames (this.FloatProperties2).forEach (prop => {
            MuBitConverter.WriteString (data, prop);
            MuBitConverter.WriteInt (data, MuEnum.PT_FLOAT_PROPERTY_2);
            MuBitConverter.WriteFloat (data, this.FloatProperties2[prop]);
        });
        
        Object.getOwnPropertyNames (this.FloatProperties3).forEach (prop => {
            MuBitConverter.WriteString (data, prop);
            MuBitConverter.WriteInt (data, MuEnum.PT_FLOAT_PROPERTY_3);
            MuBitConverter.WriteFloat (data, this.FloatProperties3[prop]);
        });
        
        Object.getOwnPropertyNames (this.TextureProperties).forEach (prop => {
            MuBitConverter.WriteString (data, prop);
            MuBitConverter.WriteInt (data, MuEnum.PT_TEXTURE_PROPERTY);
            this.TextureProperties[prop].Serialize (data);
        });
    }
    
}