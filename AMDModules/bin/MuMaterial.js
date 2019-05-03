var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./MuEnum", "./MuBitConverter", "./MuMatTex"], function (require, exports, MuEnum_1, MuBitConverter_1, MuMatTex_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    MuBitConverter_1 = __importDefault(MuBitConverter_1);
    MuMatTex_1 = __importDefault(MuMatTex_1);
    class MuMaterial {
        constructor(array) {
            this.ColorProperties = {};
            this.VectorProperties = {};
            this.FloatProperties2 = {};
            this.FloatProperties3 = {};
            this.TextureProperties = {};
            if (array.version >= 4) {
                this.Name = MuBitConverter_1.default.ReadString(array);
                this.ShaderName = MuBitConverter_1.default.ReadString(array);
                let PropertyCount = MuBitConverter_1.default.ReadInt(array);
                for (let i = 0; i < PropertyCount; ++i) {
                    let PropertyName = MuBitConverter_1.default.ReadString(array);
                    let PropertyType = MuBitConverter_1.default.ReadInt(array);
                    let r, g, b, a;
                    switch (PropertyType) {
                        case MuEnum_1.MuEnum.PT_COLOR_PROPERTY:
                            r = MuBitConverter_1.default.ReadFloat(array);
                            g = MuBitConverter_1.default.ReadFloat(array);
                            b = MuBitConverter_1.default.ReadFloat(array);
                            a = MuBitConverter_1.default.ReadFloat(array);
                            this.ColorProperties[PropertyName] = [r, g, b, a];
                            break;
                        case MuEnum_1.MuEnum.PT_VECTOR_PROPERTY:
                            r = MuBitConverter_1.default.ReadFloat(array);
                            g = MuBitConverter_1.default.ReadFloat(array);
                            b = MuBitConverter_1.default.ReadFloat(array);
                            a = MuBitConverter_1.default.ReadFloat(array);
                            this.VectorProperties[PropertyName] = [r, g, b, a];
                            break;
                        case MuEnum_1.MuEnum.PT_FLOAT_PROPERTY_2:
                            this.FloatProperties2[PropertyName] = MuBitConverter_1.default.ReadFloat(array);
                            break;
                        case MuEnum_1.MuEnum.PT_FLOAT_PROPERTY_3:
                            this.FloatProperties3[PropertyName] = MuBitConverter_1.default.ReadFloat(array);
                            break;
                        case MuEnum_1.MuEnum.PT_TEXTURE_PROPERTY:
                            this.TextureProperties[PropertyName] = new MuMatTex_1.default(array);
                            break;
                        default:
                            console.warn(`This shouldn't happen. Invalid property type: ${PropertyType}`);
                            break;
                    }
                }
            }
            else {
                this.Name = MuBitConverter_1.default.ReadString(array);
                let Type = MuBitConverter_1.default.ReadInt(array);
                this.ShaderName = MuMaterial.ShaderNames[Type];
                let r, g, b, a;
                switch (Type) {
                    case MuEnum_1.MuEnum.ST_SPECULAR:
                        this.TextureProperties["_MainTex"] = new MuMatTex_1.default(array);
                        r = MuBitConverter_1.default.ReadFloat(array);
                        g = MuBitConverter_1.default.ReadFloat(array);
                        b = MuBitConverter_1.default.ReadFloat(array);
                        a = MuBitConverter_1.default.ReadFloat(array);
                        this.ColorProperties["_SpecColor"] = [r, g, b, a];
                        this.FloatProperties3["_Shininess"] = MuBitConverter_1.default.ReadFloat(array);
                        break;
                    case MuEnum_1.MuEnum.ST_BUMPED:
                        this.TextureProperties["_MainTex"] = new MuMatTex_1.default(array);
                        this.TextureProperties["_BumpMap"] = new MuMatTex_1.default(array);
                        break;
                    case MuEnum_1.MuEnum.ST_BUMPED_SPECULAR:
                        this.TextureProperties["_MainTex"] = new MuMatTex_1.default(array);
                        this.TextureProperties["_BumpMap"] = new MuMatTex_1.default(array);
                        r = MuBitConverter_1.default.ReadFloat(array);
                        g = MuBitConverter_1.default.ReadFloat(array);
                        b = MuBitConverter_1.default.ReadFloat(array);
                        a = MuBitConverter_1.default.ReadFloat(array);
                        this.ColorProperties["_SpecColor"] = [r, g, b, a];
                        this.FloatProperties3["_Shininess"] = MuBitConverter_1.default.ReadFloat(array);
                        break;
                    case MuEnum_1.MuEnum.ST_EMISSIVE:
                        this.TextureProperties["_MainTex"] = new MuMatTex_1.default(array);
                        this.TextureProperties["_Emissive"] = new MuMatTex_1.default(array);
                        r = MuBitConverter_1.default.ReadFloat(array);
                        g = MuBitConverter_1.default.ReadFloat(array);
                        b = MuBitConverter_1.default.ReadFloat(array);
                        a = MuBitConverter_1.default.ReadFloat(array);
                        this.ColorProperties["_EmissiveColor"] = [r, g, b, a];
                        break;
                    case MuEnum_1.MuEnum.ST_EMISSIVE_SPECULAR:
                        this.TextureProperties["_MainTex"] = new MuMatTex_1.default(array);
                        r = MuBitConverter_1.default.ReadFloat(array);
                        g = MuBitConverter_1.default.ReadFloat(array);
                        b = MuBitConverter_1.default.ReadFloat(array);
                        a = MuBitConverter_1.default.ReadFloat(array);
                        this.ColorProperties["_SpecColor"] = [r, g, b, a];
                        this.FloatProperties3["_Shininess"] = MuBitConverter_1.default.ReadFloat(array);
                        this.TextureProperties["_Emissive"] = new MuMatTex_1.default(array);
                        r = MuBitConverter_1.default.ReadFloat(array);
                        g = MuBitConverter_1.default.ReadFloat(array);
                        b = MuBitConverter_1.default.ReadFloat(array);
                        a = MuBitConverter_1.default.ReadFloat(array);
                        this.ColorProperties["_EmissiveColor"] = [r, g, b, a];
                        break;
                    case MuEnum_1.MuEnum.ST_EMISSIVE_BUMPED_SPECULAR:
                        this.TextureProperties["_MainTex"] = new MuMatTex_1.default(array);
                        this.TextureProperties["_BumpMap"] = new MuMatTex_1.default(array);
                        r = MuBitConverter_1.default.ReadFloat(array);
                        g = MuBitConverter_1.default.ReadFloat(array);
                        b = MuBitConverter_1.default.ReadFloat(array);
                        a = MuBitConverter_1.default.ReadFloat(array);
                        this.ColorProperties["_SpecColor"] = [r, g, b, a];
                        this.FloatProperties3["_Shininess"] = MuBitConverter_1.default.ReadFloat(array);
                        this.TextureProperties["_Emissive"] = new MuMatTex_1.default(array);
                        r = MuBitConverter_1.default.ReadFloat(array);
                        g = MuBitConverter_1.default.ReadFloat(array);
                        b = MuBitConverter_1.default.ReadFloat(array);
                        a = MuBitConverter_1.default.ReadFloat(array);
                        this.ColorProperties["_EmissiveColor"] = [r, g, b, a];
                        break;
                    case MuEnum_1.MuEnum.ST_ALPHA_CUTOFF:
                        this.TextureProperties["_MainTex"] = new MuMatTex_1.default(array);
                        this.FloatProperties3["_Cutoff"] = MuBitConverter_1.default.ReadFloat(array);
                        break;
                    case MuEnum_1.MuEnum.ST_ALPHA_CUTOFF_BUMPED:
                        this.TextureProperties["_MainTex"] = new MuMatTex_1.default(array);
                        this.TextureProperties["_BumpMap"] = new MuMatTex_1.default(array);
                        this.FloatProperties3["_Cutoff"] = MuBitConverter_1.default.ReadFloat(array);
                        break;
                    case MuEnum_1.MuEnum.ST_ALPHA:
                        this.TextureProperties["_MainTex"] = new MuMatTex_1.default(array);
                        break;
                    case MuEnum_1.MuEnum.ST_ALPHA_SPECULAR:
                        this.TextureProperties["_MainTex"] = new MuMatTex_1.default(array);
                        this.FloatProperties3["_Gloss"] = MuBitConverter_1.default.ReadFloat(array);
                        r = MuBitConverter_1.default.ReadFloat(array);
                        g = MuBitConverter_1.default.ReadFloat(array);
                        b = MuBitConverter_1.default.ReadFloat(array);
                        a = MuBitConverter_1.default.ReadFloat(array);
                        this.ColorProperties["_SpecColor"] = [r, g, b, a];
                        this.FloatProperties3["_Shininess"] = MuBitConverter_1.default.ReadFloat(array);
                        break;
                    case MuEnum_1.MuEnum.ST_ALPHA_UNLIT:
                    case MuEnum_1.MuEnum.ST_UNLIT:
                        this.TextureProperties["_MainTex"] = new MuMatTex_1.default(array);
                        r = MuBitConverter_1.default.ReadFloat(array);
                        g = MuBitConverter_1.default.ReadFloat(array);
                        b = MuBitConverter_1.default.ReadFloat(array);
                        a = MuBitConverter_1.default.ReadFloat(array);
                        this.ColorProperties["_Color"] = [r, g, b, a];
                        break;
                    case MuEnum_1.MuEnum.ST_PARTICLES_ALPHA_BLENDED:
                    case MuEnum_1.MuEnum.ST_PARTICLES_ADDITIVE:
                        this.TextureProperties["_MainTex"] = new MuMatTex_1.default(array);
                        r = MuBitConverter_1.default.ReadFloat(array);
                        g = MuBitConverter_1.default.ReadFloat(array);
                        b = MuBitConverter_1.default.ReadFloat(array);
                        a = MuBitConverter_1.default.ReadFloat(array);
                        this.ColorProperties["_Color"] = [r, g, b, a];
                        this.FloatProperties3["_InvFade"] = MuBitConverter_1.default.ReadFloat(array);
                        break;
                    case MuEnum_1.MuEnum.ST_DIFFUSE:
                        this.TextureProperties["_MainTex"] = new MuMatTex_1.default(array);
                        break;
                    default:
                        throw `Wrong material type: ${Type} @${array.offset}`;
                }
            }
        }
        Serialize(data) {
            let PropertyCount = Object.getOwnPropertyNames(this.ColorProperties).length;
            PropertyCount += Object.getOwnPropertyNames(this.VectorProperties).length;
            PropertyCount += Object.getOwnPropertyNames(this.FloatProperties2).length;
            PropertyCount += Object.getOwnPropertyNames(this.FloatProperties3).length;
            PropertyCount += Object.getOwnPropertyNames(this.TextureProperties).length;
            MuBitConverter_1.default.WriteString(data, this.Name);
            MuBitConverter_1.default.WriteString(data, this.ShaderName);
            MuBitConverter_1.default.WriteInt(data, PropertyCount);
            Object.getOwnPropertyNames(this.ColorProperties).forEach(prop => {
                MuBitConverter_1.default.WriteString(data, prop);
                MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.PT_COLOR_PROPERTY);
                MuBitConverter_1.default.WriteFloat(data, this.ColorProperties[prop][0]);
                MuBitConverter_1.default.WriteFloat(data, this.ColorProperties[prop][1]);
                MuBitConverter_1.default.WriteFloat(data, this.ColorProperties[prop][2]);
                MuBitConverter_1.default.WriteFloat(data, this.ColorProperties[prop][3]);
            });
            Object.getOwnPropertyNames(this.VectorProperties).forEach(prop => {
                MuBitConverter_1.default.WriteString(data, prop);
                MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.PT_VECTOR_PROPERTY);
                MuBitConverter_1.default.WriteFloat(data, this.VectorProperties[prop][0]);
                MuBitConverter_1.default.WriteFloat(data, this.VectorProperties[prop][1]);
                MuBitConverter_1.default.WriteFloat(data, this.VectorProperties[prop][2]);
                MuBitConverter_1.default.WriteFloat(data, this.VectorProperties[prop][3]);
            });
            Object.getOwnPropertyNames(this.FloatProperties2).forEach(prop => {
                MuBitConverter_1.default.WriteString(data, prop);
                MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.PT_FLOAT_PROPERTY_2);
                MuBitConverter_1.default.WriteFloat(data, this.FloatProperties2[prop]);
            });
            Object.getOwnPropertyNames(this.FloatProperties3).forEach(prop => {
                MuBitConverter_1.default.WriteString(data, prop);
                MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.PT_FLOAT_PROPERTY_3);
                MuBitConverter_1.default.WriteFloat(data, this.FloatProperties3[prop]);
            });
            Object.getOwnPropertyNames(this.TextureProperties).forEach(prop => {
                MuBitConverter_1.default.WriteString(data, prop);
                MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.PT_TEXTURE_PROPERTY);
                this.TextureProperties[prop].Serialize(data);
            });
        }
    }
    MuMaterial.ShaderNames = [
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
    exports.default = MuMaterial;
});
//# sourceMappingURL=MuMaterial.js.map