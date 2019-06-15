"use strict";
class Mu {
    constructor(data) {
        let array = {
            data: data,
            offset: 0,
            version: 0
        };
        this.Magic = MuBitConverter.ReadInt(array);
        this.Version = MuBitConverter.ReadInt(array);
        array.version = this.Version;
        if (this.Magic != MuEnum.MODEL_BINARY ||
            this.Version < 0 ||
            this.Version > MuEnum.FILE_VERSION) {
            throw `Errors found in mu file @${array.offset}`;
        }
        this.Name = MuBitConverter.ReadString(array);
        this.Object = new MuObject(array);
    }
    Serialize() {
        let data = [];
        MuBitConverter.WriteInt(data, MuEnum.MODEL_BINARY);
        MuBitConverter.WriteInt(data, MuEnum.FILE_VERSION);
        MuBitConverter.WriteString(data, this.Name);
        this.Object.Serialize(data);
        return new Uint8Array(data);
    }
}
class MuAnimation {
    constructor(array) {
        this.Clips = [];
        let ClipCount = MuBitConverter.ReadInt(array);
        for (let i = 0; i < ClipCount; ++i) {
            this.Clips.push(new MuClip(array));
        }
        this.ClipName = MuBitConverter.ReadString(array);
        this.Autoplay = MuBitConverter.ReadByte(array);
    }
    Serialize(data) {
        MuBitConverter.WriteInt(data, MuEnum.ET_ANIMATION);
        MuBitConverter.WriteInt(data, this.Clips.length);
        this.Clips.forEach(clip => {
            clip.Serialize(data);
        });
        MuBitConverter.WriteString(data, this.ClipName);
        MuBitConverter.WriteByte(data, this.Autoplay);
    }
}
class MuBitConverter {
    static ReadByte(array) {
        if (array.data.length < array.offset + 1) {
            throw `EOF @${array.offset}`;
        }
        return array.data[array.offset++];
    }
    static ReadInt(array) {
        if (array.data.length < array.offset + 4) {
            throw `EOF @${array.offset}`;
        }
        let output = 0;
        output += array.data[array.offset++];
        output += array.data[array.offset++] << 8;
        output += array.data[array.offset++] << 16;
        output += array.data[array.offset++] << 24;
        return output;
    }
    static Read7Int(array) {
        let output = 0;
        let multiplier = 1;
        while (true) {
            let currentByte = this.ReadByte(array);
            output += (currentByte & 127) * multiplier;
            if (currentByte < 128) {
                break;
            }
            multiplier *= 128;
        }
        return output;
    }
    static ReadUInt(array) {
        if (array.data.length < array.offset + 4) {
            throw `EOF @${array.offset}`;
        }
        let output = 0;
        output += (array.data[array.offset++]) >>> 0;
        output += (array.data[array.offset++] << 8) >>> 0;
        output += (array.data[array.offset++] << 16) >>> 0;
        output += (array.data[array.offset++] << 24) >>> 0;
        return output;
    }
    static ReadFloat(array) {
        let buffer = new ArrayBuffer(4);
        new Int32Array(buffer)[0] = this.ReadInt(array);
        return new Float32Array(buffer)[0];
    }
    static ReadVector(array) {
        let x = this.ReadFloat(array);
        let y = this.ReadFloat(array);
        let z = this.ReadFloat(array);
        return [x, z, y];
    }
    static ReadQuaternion(array) {
        let x = this.ReadFloat(array);
        let y = this.ReadFloat(array);
        let z = this.ReadFloat(array);
        let w = this.ReadFloat(array);
        return [w, -x, -z, -y];
    }
    static ReadTangent(array) {
        let x = this.ReadFloat(array);
        let y = this.ReadFloat(array);
        let z = this.ReadFloat(array);
        let w = this.ReadFloat(array);
        return [x, z, y, -w];
    }
    static ReadColor(array) {
        let r = array.data[array.offset++] / 255;
        let g = array.data[array.offset++] / 255;
        let b = array.data[array.offset++] / 255;
        let a = array.data[array.offset++] / 255;
        return [r, g, b, a];
    }
    static ReadBytes(array, length) {
        if (array.data.length < array.offset + length) {
            throw `EOF @${array.offset}`;
        }
        array.offset += length;
        return array.data.slice(array.offset - length, array.offset);
    }
    static ReadString(array) {
        let length = this.Read7Int(array);
        let stringData = this.ReadBytes(array, length);
        let output = "";
        stringData.forEach(c => {
            output += String.fromCharCode(c);
        });
        return output;
    }
    static WriteByte(data, value) {
        data.push(Math.round(value) & 255);
    }
    static WriteInt(data, value) {
        value = Math.round(value);
        data.push(value & 255);
        data.push((value >> 8) & 255);
        data.push((value >> 16) & 255);
        data.push((value >> 24) & 255);
    }
    static Write7Int(data, value) {
        value = Math.round(value);
        if (value < 0) {
            value += Math.pow(2, 32);
        }
        value &= -1;
        while (value > 127) {
            data.push(value & 127 + 128);
            value >>= 7;
        }
        data.push(value);
    }
    static WriteUInt(data, value) {
        this.WriteInt(data, value);
    }
    static WriteFloat(data, value) {
        let buffer = new ArrayBuffer(4);
        new Float32Array(buffer)[0] = value;
        let rawValue = new Uint32Array(buffer)[0];
        data.push(rawValue & 255);
        data.push((rawValue >>> 8) & 255);
        data.push((rawValue >>> 16) & 255);
        data.push((rawValue >>> 24) & 255);
    }
    static WriteVector(data, value) {
        let [x, z, y] = value;
        this.WriteFloat(data, x);
        this.WriteFloat(data, y);
        this.WriteFloat(data, z);
    }
    static WriteQuaternion(data, value) {
        this.WriteFloat(data, -value[1]);
        this.WriteFloat(data, -value[3]);
        this.WriteFloat(data, -value[2]);
        this.WriteFloat(data, value[0]);
    }
    static WriteTangent(data, value) {
        let [x, z, y, w] = value;
        this.WriteFloat(data, x);
        this.WriteFloat(data, y);
        this.WriteFloat(data, z);
        this.WriteFloat(data, -w);
    }
    static WriteColor(data, value) {
        let [r, g, b, a] = value;
        this.WriteByte(data, Math.round(Math.max(Math.min(r, 1), 0) * 255));
        this.WriteByte(data, Math.round(Math.max(Math.min(g, 1), 0) * 255));
        this.WriteByte(data, Math.round(Math.max(Math.min(b, 1), 0) * 255));
        this.WriteByte(data, Math.round(Math.max(Math.min(a, 1), 0) * 255));
    }
    static WriteBytes(data, value) {
        value.forEach(b => {
            data.push(b);
        });
    }
    static WriteString(data, value) {
        this.Write7Int(data, value.length);
        for (let i = 0; i < value.length; ++i) {
            data.push(value.charCodeAt(i));
        }
    }
}
class MuBoneWeight {
    constructor(array) {
        let I1 = MuBitConverter.ReadInt(array);
        let W1 = MuBitConverter.ReadFloat(array);
        let I2 = MuBitConverter.ReadInt(array);
        let W2 = MuBitConverter.ReadFloat(array);
        let I3 = MuBitConverter.ReadInt(array);
        let W3 = MuBitConverter.ReadFloat(array);
        let I4 = MuBitConverter.ReadInt(array);
        let W4 = MuBitConverter.ReadFloat(array);
        this.Indices = [I1, I2, I3, I4];
        this.Weights = [W1, W2, W3, W4];
    }
    Serialize(data) {
        MuBitConverter.WriteInt(data, this.Indices[0]);
        MuBitConverter.WriteFloat(data, this.Weights[0]);
        MuBitConverter.WriteInt(data, this.Indices[1]);
        MuBitConverter.WriteFloat(data, this.Weights[1]);
        MuBitConverter.WriteInt(data, this.Indices[2]);
        MuBitConverter.WriteFloat(data, this.Weights[2]);
        MuBitConverter.WriteInt(data, this.Indices[3]);
        MuBitConverter.WriteFloat(data, this.Weights[3]);
    }
}
class MuCamera {
    constructor(array) {
        this.BackgroundColor = [0, 0, 0, 0];
        this.ClearFlags = MuBitConverter.ReadInt(array);
        this.BackgroundColor[0] = MuBitConverter.ReadFloat(array);
        this.BackgroundColor[1] = MuBitConverter.ReadFloat(array);
        this.BackgroundColor[2] = MuBitConverter.ReadFloat(array);
        this.BackgroundColor[3] = MuBitConverter.ReadFloat(array);
        this.CullingMask = MuBitConverter.ReadUInt(array);
        this.Orthographic = MuBitConverter.ReadByte(array);
        this.FOV = MuBitConverter.ReadFloat(array);
        this.Near = MuBitConverter.ReadFloat(array);
        this.Far = MuBitConverter.ReadFloat(array);
        this.Depth = MuBitConverter.ReadFloat(array);
    }
    Serialize(data) {
        MuBitConverter.WriteInt(data, MuEnum.ET_CAMERA);
        MuBitConverter.WriteInt(data, this.ClearFlags);
        MuBitConverter.WriteFloat(data, this.BackgroundColor[0]);
        MuBitConverter.WriteFloat(data, this.BackgroundColor[1]);
        MuBitConverter.WriteFloat(data, this.BackgroundColor[2]);
        MuBitConverter.WriteFloat(data, this.BackgroundColor[3]);
        MuBitConverter.WriteUInt(data, this.CullingMask);
        MuBitConverter.WriteByte(data, this.Orthographic);
        MuBitConverter.WriteFloat(data, this.FOV);
        MuBitConverter.WriteFloat(data, this.Near);
        MuBitConverter.WriteFloat(data, this.Far);
        MuBitConverter.WriteFloat(data, this.Depth);
    }
}
class MuClip {
    constructor(array) {
        this.Curves = [];
        this.Name = MuBitConverter.ReadString(array);
        this.lbCenter = MuBitConverter.ReadVector(array);
        this.lbSize = MuBitConverter.ReadVector(array);
        this.WrapMode = MuBitConverter.ReadInt(array);
        let CurveCount = MuBitConverter.ReadInt(array);
        for (let i = 0; i < CurveCount; ++i) {
            this.Curves.push(new MuCurve(array));
        }
    }
    Serialize(data) {
        MuBitConverter.WriteString(data, this.Name);
        MuBitConverter.WriteVector(data, this.lbCenter);
        MuBitConverter.WriteVector(data, this.lbSize);
        MuBitConverter.WriteInt(data, this.WrapMode);
        MuBitConverter.WriteInt(data, this.Curves.length);
        this.Curves.forEach(curve => {
            curve.Serialize(data);
        });
    }
}
class MuCurve {
    constructor(array) {
        this.WrapMode = [0, 0];
        this.Keys = [];
        this.Path = MuBitConverter.ReadString(array);
        this.Property = MuBitConverter.ReadString(array);
        this.Type = MuBitConverter.ReadInt(array);
        this.WrapMode[0] = MuBitConverter.ReadInt(array);
        this.WrapMode[1] = MuBitConverter.ReadInt(array);
        let KeyCount = MuBitConverter.ReadInt(array);
        for (let i = 0; i < KeyCount; ++i) {
            this.Keys.push(new MuKey(array));
        }
    }
    Serialize(data) {
        MuBitConverter.WriteString(data, this.Path);
        MuBitConverter.WriteString(data, this.Property);
        MuBitConverter.WriteInt(data, this.Type);
        MuBitConverter.WriteInt(data, this.WrapMode[0]);
        MuBitConverter.WriteInt(data, this.WrapMode[1]);
        MuBitConverter.WriteInt(data, this.Keys.length);
        this.Keys.forEach(key => {
            key.Serialize(data);
        });
    }
}
var MuEnum;
(function (MuEnum) {
    MuEnum[MuEnum["MODEL_BINARY"] = 76543] = "MODEL_BINARY";
    MuEnum[MuEnum["FILE_VERSION"] = 5] = "FILE_VERSION";
    MuEnum[MuEnum["ET_CHILD_TRANSFORM_START"] = 0] = "ET_CHILD_TRANSFORM_START";
    MuEnum[MuEnum["ET_CHILD_TRANSFORM_END"] = 1] = "ET_CHILD_TRANSFORM_END";
    MuEnum[MuEnum["ET_ANIMATION"] = 2] = "ET_ANIMATION";
    MuEnum[MuEnum["ET_MESH_COLLIDER"] = 3] = "ET_MESH_COLLIDER";
    MuEnum[MuEnum["ET_SPHERE_COLLIDER"] = 4] = "ET_SPHERE_COLLIDER";
    MuEnum[MuEnum["ET_CAPSULE_COLLIDER"] = 5] = "ET_CAPSULE_COLLIDER";
    MuEnum[MuEnum["ET_BOX_COLLIDER"] = 6] = "ET_BOX_COLLIDER";
    MuEnum[MuEnum["ET_MESH_FILTER"] = 7] = "ET_MESH_FILTER";
    MuEnum[MuEnum["ET_MESH_RENDERER"] = 8] = "ET_MESH_RENDERER";
    MuEnum[MuEnum["ET_SKINNED_MESH_RENDERER"] = 9] = "ET_SKINNED_MESH_RENDERER";
    MuEnum[MuEnum["ET_MATERIALS"] = 10] = "ET_MATERIALS";
    MuEnum[MuEnum["ET_MATERIAL"] = 11] = "ET_MATERIAL";
    MuEnum[MuEnum["ET_TEXTURES"] = 12] = "ET_TEXTURES";
    MuEnum[MuEnum["ET_MESH_START"] = 13] = "ET_MESH_START";
    MuEnum[MuEnum["ET_MESH_VERTS"] = 14] = "ET_MESH_VERTS";
    MuEnum[MuEnum["ET_MESH_UV"] = 15] = "ET_MESH_UV";
    MuEnum[MuEnum["ET_MESH_UV2"] = 16] = "ET_MESH_UV2";
    MuEnum[MuEnum["ET_MESH_NORMALS"] = 17] = "ET_MESH_NORMALS";
    MuEnum[MuEnum["ET_MESH_TANGENTS"] = 18] = "ET_MESH_TANGENTS";
    MuEnum[MuEnum["ET_MESH_TRIANGLES"] = 19] = "ET_MESH_TRIANGLES";
    MuEnum[MuEnum["ET_MESH_BONE_WEIGHTS"] = 20] = "ET_MESH_BONE_WEIGHTS";
    MuEnum[MuEnum["ET_MESH_BIND_POSES"] = 21] = "ET_MESH_BIND_POSES";
    MuEnum[MuEnum["ET_MESH_END"] = 22] = "ET_MESH_END";
    MuEnum[MuEnum["ET_LIGHT"] = 23] = "ET_LIGHT";
    MuEnum[MuEnum["ET_TAG_AND_LAYER"] = 24] = "ET_TAG_AND_LAYER";
    MuEnum[MuEnum["ET_MESH_COLLIDER2"] = 25] = "ET_MESH_COLLIDER2";
    MuEnum[MuEnum["ET_SPHERE_COLLIDER2"] = 26] = "ET_SPHERE_COLLIDER2";
    MuEnum[MuEnum["ET_CAPSULE_COLLIDER2"] = 27] = "ET_CAPSULE_COLLIDER2";
    MuEnum[MuEnum["ET_BOX_COLLIDER2"] = 28] = "ET_BOX_COLLIDER2";
    MuEnum[MuEnum["ET_WHEEL_COLLIDER"] = 29] = "ET_WHEEL_COLLIDER";
    MuEnum[MuEnum["ET_CAMERA"] = 30] = "ET_CAMERA";
    MuEnum[MuEnum["ET_PARTICLES"] = 31] = "ET_PARTICLES";
    MuEnum[MuEnum["ET_MESH_VERTEX_COLORS"] = 32] = "ET_MESH_VERTEX_COLORS";
    MuEnum[MuEnum["ST_CUSTOM"] = 0] = "ST_CUSTOM";
    MuEnum[MuEnum["ST_DIFFUSE"] = 1] = "ST_DIFFUSE";
    MuEnum[MuEnum["ST_SPECULAR"] = 2] = "ST_SPECULAR";
    MuEnum[MuEnum["ST_BUMPED"] = 3] = "ST_BUMPED";
    MuEnum[MuEnum["ST_BUMPED_SPECULAR"] = 4] = "ST_BUMPED_SPECULAR";
    MuEnum[MuEnum["ST_EMISSIVE"] = 5] = "ST_EMISSIVE";
    MuEnum[MuEnum["ST_EMISSIVE_SPECULAR"] = 6] = "ST_EMISSIVE_SPECULAR";
    MuEnum[MuEnum["ST_EMISSIVE_BUMPED_SPECULAR"] = 7] = "ST_EMISSIVE_BUMPED_SPECULAR";
    MuEnum[MuEnum["ST_ALPHA_CUTOFF"] = 8] = "ST_ALPHA_CUTOFF";
    MuEnum[MuEnum["ST_ALPHA_CUTOFF_BUMPED"] = 9] = "ST_ALPHA_CUTOFF_BUMPED";
    MuEnum[MuEnum["ST_ALPHA"] = 10] = "ST_ALPHA";
    MuEnum[MuEnum["ST_ALPHA_SPECULAR"] = 11] = "ST_ALPHA_SPECULAR";
    MuEnum[MuEnum["ST_ALPHA_UNLIT"] = 12] = "ST_ALPHA_UNLIT";
    MuEnum[MuEnum["ST_UNLIT"] = 13] = "ST_UNLIT";
    MuEnum[MuEnum["ST_PARTICLES_ALPHA_BLENDED"] = 14] = "ST_PARTICLES_ALPHA_BLENDED";
    MuEnum[MuEnum["ST_PARTICLES_ADDITIVE"] = 15] = "ST_PARTICLES_ADDITIVE";
    MuEnum[MuEnum["AT_TRANSFORM"] = 0] = "AT_TRANSFORM";
    MuEnum[MuEnum["AT_MATERIAL"] = 1] = "AT_MATERIAL";
    MuEnum[MuEnum["AT_LIGHT"] = 2] = "AT_LIGHT";
    MuEnum[MuEnum["AT_AUDIO_SOURCE"] = 3] = "AT_AUDIO_SOURCE";
    MuEnum[MuEnum["TT_TEXTURE"] = 0] = "TT_TEXTURE";
    MuEnum[MuEnum["TT_NORMAL_MAP"] = 1] = "TT_NORMAL_MAP";
    MuEnum[MuEnum["PT_COLOR_PROPERTY"] = 0] = "PT_COLOR_PROPERTY";
    MuEnum[MuEnum["PT_VECTOR_PROPERTY"] = 1] = "PT_VECTOR_PROPERTY";
    MuEnum[MuEnum["PT_FLOAT_PROPERTY_2"] = 2] = "PT_FLOAT_PROPERTY_2";
    MuEnum[MuEnum["PT_FLOAT_PROPERTY_3"] = 3] = "PT_FLOAT_PROPERTY_3";
    MuEnum[MuEnum["PT_TEXTURE_PROPERTY"] = 4] = "PT_TEXTURE_PROPERTY";
})(MuEnum || (MuEnum = {}));
class MuFriction {
    constructor(array) {
        this.ExtremumSlip = MuBitConverter.ReadFloat(array);
        this.ExtremumValue = MuBitConverter.ReadFloat(array);
        this.AsymptoteSlip = MuBitConverter.ReadFloat(array);
        this.AsymptoteValue = MuBitConverter.ReadFloat(array);
        this.Stiffness = MuBitConverter.ReadFloat(array);
    }
    Serialize(data) {
        MuBitConverter.WriteFloat(data, this.ExtremumSlip);
        MuBitConverter.WriteFloat(data, this.ExtremumValue);
        MuBitConverter.WriteFloat(data, this.AsymptoteSlip);
        MuBitConverter.WriteFloat(data, this.AsymptoteValue);
        MuBitConverter.WriteFloat(data, this.Stiffness);
    }
}
class MuKey {
    constructor(array) {
        this.Tangent = [0, 0];
        this.Time = MuBitConverter.ReadFloat(array);
        this.Value = MuBitConverter.ReadFloat(array);
        this.Tangent[0] = MuBitConverter.ReadFloat(array);
        this.Tangent[1] = MuBitConverter.ReadFloat(array);
        this.TangentMode = MuBitConverter.ReadInt(array);
    }
    Serialize(data) {
        MuBitConverter.WriteFloat(data, this.Time);
        MuBitConverter.WriteFloat(data, this.Value);
        MuBitConverter.WriteFloat(data, this.Tangent[0]);
        MuBitConverter.WriteFloat(data, this.Tangent[1]);
        MuBitConverter.WriteInt(data, this.TangentMode);
    }
}
class MuLight {
    constructor(array) {
        this.Color = [0, 0, 0, 0];
        this.SpotAngle = 0;
        this.Type = MuBitConverter.ReadInt(array);
        this.Intensity = MuBitConverter.ReadFloat(array);
        this.Range = MuBitConverter.ReadFloat(array);
        this.Color[0] = MuBitConverter.ReadFloat(array);
        this.Color[1] = MuBitConverter.ReadFloat(array);
        this.Color[2] = MuBitConverter.ReadFloat(array);
        this.Color[3] = MuBitConverter.ReadFloat(array);
        this.CullingMask = MuBitConverter.ReadUInt(array);
        if (array.version > 1) {
            this.SpotAngle = MuBitConverter.ReadFloat(array);
        }
    }
    Serialize(data) {
        MuBitConverter.WriteInt(data, MuEnum.ET_LIGHT);
        MuBitConverter.WriteInt(data, this.Type);
        MuBitConverter.WriteFloat(data, this.Intensity);
        MuBitConverter.WriteFloat(data, this.Range);
        MuBitConverter.WriteFloat(data, this.Color[0]);
        MuBitConverter.WriteFloat(data, this.Color[1]);
        MuBitConverter.WriteFloat(data, this.Color[2]);
        MuBitConverter.WriteFloat(data, this.Color[3]);
        MuBitConverter.WriteUInt(data, this.CullingMask);
        MuBitConverter.WriteFloat(data, this.SpotAngle);
    }
}
class MuMatTex {
    constructor(array) {
        this.Scale = [0, 0];
        this.Offset = [0, 0];
        this.Index = MuBitConverter.ReadInt(array);
        this.Scale[0] = MuBitConverter.ReadFloat(array);
        this.Scale[1] = MuBitConverter.ReadFloat(array);
        this.Offset[0] = MuBitConverter.ReadFloat(array);
        this.Offset[1] = MuBitConverter.ReadFloat(array);
    }
    Serialize(data) {
        MuBitConverter.WriteInt(data, this.Index);
        MuBitConverter.WriteFloat(data, this.Scale[0]);
        MuBitConverter.WriteFloat(data, this.Scale[1]);
        MuBitConverter.WriteFloat(data, this.Offset[0]);
        MuBitConverter.WriteFloat(data, this.Offset[1]);
    }
}
class MuMaterial {
    constructor(array) {
        this.ColorProperties = {};
        this.VectorProperties = {};
        this.FloatProperties2 = {};
        this.FloatProperties3 = {};
        this.TextureProperties = {};
        if (array.version >= 4) {
            this.Name = MuBitConverter.ReadString(array);
            this.ShaderName = MuBitConverter.ReadString(array);
            let PropertyCount = MuBitConverter.ReadInt(array);
            for (let i = 0; i < PropertyCount; ++i) {
                let PropertyName = MuBitConverter.ReadString(array);
                let PropertyType = MuBitConverter.ReadInt(array);
                let r, g, b, a;
                switch (PropertyType) {
                    case MuEnum.PT_COLOR_PROPERTY:
                        r = MuBitConverter.ReadFloat(array);
                        g = MuBitConverter.ReadFloat(array);
                        b = MuBitConverter.ReadFloat(array);
                        a = MuBitConverter.ReadFloat(array);
                        this.ColorProperties[PropertyName] = [r, g, b, a];
                        break;
                    case MuEnum.PT_VECTOR_PROPERTY:
                        r = MuBitConverter.ReadFloat(array);
                        g = MuBitConverter.ReadFloat(array);
                        b = MuBitConverter.ReadFloat(array);
                        a = MuBitConverter.ReadFloat(array);
                        this.VectorProperties[PropertyName] = [r, g, b, a];
                        break;
                    case MuEnum.PT_FLOAT_PROPERTY_2:
                        this.FloatProperties2[PropertyName] = MuBitConverter.ReadFloat(array);
                        break;
                    case MuEnum.PT_FLOAT_PROPERTY_3:
                        this.FloatProperties3[PropertyName] = MuBitConverter.ReadFloat(array);
                        break;
                    case MuEnum.PT_TEXTURE_PROPERTY:
                        this.TextureProperties[PropertyName] = new MuMatTex(array);
                        break;
                    default:
                        console.warn(`This shouldn't happen. Invalid property type: ${PropertyType}`);
                        break;
                }
            }
        }
        else {
            this.Name = MuBitConverter.ReadString(array);
            let Type = MuBitConverter.ReadInt(array);
            this.ShaderName = MuMaterial.ShaderNames[Type];
            let r, g, b, a;
            switch (Type) {
                case MuEnum.ST_SPECULAR:
                    this.TextureProperties["_MainTex"] = new MuMatTex(array);
                    r = MuBitConverter.ReadFloat(array);
                    g = MuBitConverter.ReadFloat(array);
                    b = MuBitConverter.ReadFloat(array);
                    a = MuBitConverter.ReadFloat(array);
                    this.ColorProperties["_SpecColor"] = [r, g, b, a];
                    this.FloatProperties3["_Shininess"] = MuBitConverter.ReadFloat(array);
                    break;
                case MuEnum.ST_BUMPED:
                    this.TextureProperties["_MainTex"] = new MuMatTex(array);
                    this.TextureProperties["_BumpMap"] = new MuMatTex(array);
                    break;
                case MuEnum.ST_BUMPED_SPECULAR:
                    this.TextureProperties["_MainTex"] = new MuMatTex(array);
                    this.TextureProperties["_BumpMap"] = new MuMatTex(array);
                    r = MuBitConverter.ReadFloat(array);
                    g = MuBitConverter.ReadFloat(array);
                    b = MuBitConverter.ReadFloat(array);
                    a = MuBitConverter.ReadFloat(array);
                    this.ColorProperties["_SpecColor"] = [r, g, b, a];
                    this.FloatProperties3["_Shininess"] = MuBitConverter.ReadFloat(array);
                    break;
                case MuEnum.ST_EMISSIVE:
                    this.TextureProperties["_MainTex"] = new MuMatTex(array);
                    this.TextureProperties["_Emissive"] = new MuMatTex(array);
                    r = MuBitConverter.ReadFloat(array);
                    g = MuBitConverter.ReadFloat(array);
                    b = MuBitConverter.ReadFloat(array);
                    a = MuBitConverter.ReadFloat(array);
                    this.ColorProperties["_EmissiveColor"] = [r, g, b, a];
                    break;
                case MuEnum.ST_EMISSIVE_SPECULAR:
                    this.TextureProperties["_MainTex"] = new MuMatTex(array);
                    r = MuBitConverter.ReadFloat(array);
                    g = MuBitConverter.ReadFloat(array);
                    b = MuBitConverter.ReadFloat(array);
                    a = MuBitConverter.ReadFloat(array);
                    this.ColorProperties["_SpecColor"] = [r, g, b, a];
                    this.FloatProperties3["_Shininess"] = MuBitConverter.ReadFloat(array);
                    this.TextureProperties["_Emissive"] = new MuMatTex(array);
                    r = MuBitConverter.ReadFloat(array);
                    g = MuBitConverter.ReadFloat(array);
                    b = MuBitConverter.ReadFloat(array);
                    a = MuBitConverter.ReadFloat(array);
                    this.ColorProperties["_EmissiveColor"] = [r, g, b, a];
                    break;
                case MuEnum.ST_EMISSIVE_BUMPED_SPECULAR:
                    this.TextureProperties["_MainTex"] = new MuMatTex(array);
                    this.TextureProperties["_BumpMap"] = new MuMatTex(array);
                    r = MuBitConverter.ReadFloat(array);
                    g = MuBitConverter.ReadFloat(array);
                    b = MuBitConverter.ReadFloat(array);
                    a = MuBitConverter.ReadFloat(array);
                    this.ColorProperties["_SpecColor"] = [r, g, b, a];
                    this.FloatProperties3["_Shininess"] = MuBitConverter.ReadFloat(array);
                    this.TextureProperties["_Emissive"] = new MuMatTex(array);
                    r = MuBitConverter.ReadFloat(array);
                    g = MuBitConverter.ReadFloat(array);
                    b = MuBitConverter.ReadFloat(array);
                    a = MuBitConverter.ReadFloat(array);
                    this.ColorProperties["_EmissiveColor"] = [r, g, b, a];
                    break;
                case MuEnum.ST_ALPHA_CUTOFF:
                    this.TextureProperties["_MainTex"] = new MuMatTex(array);
                    this.FloatProperties3["_Cutoff"] = MuBitConverter.ReadFloat(array);
                    break;
                case MuEnum.ST_ALPHA_CUTOFF_BUMPED:
                    this.TextureProperties["_MainTex"] = new MuMatTex(array);
                    this.TextureProperties["_BumpMap"] = new MuMatTex(array);
                    this.FloatProperties3["_Cutoff"] = MuBitConverter.ReadFloat(array);
                    break;
                case MuEnum.ST_ALPHA:
                    this.TextureProperties["_MainTex"] = new MuMatTex(array);
                    break;
                case MuEnum.ST_ALPHA_SPECULAR:
                    this.TextureProperties["_MainTex"] = new MuMatTex(array);
                    this.FloatProperties3["_Gloss"] = MuBitConverter.ReadFloat(array);
                    r = MuBitConverter.ReadFloat(array);
                    g = MuBitConverter.ReadFloat(array);
                    b = MuBitConverter.ReadFloat(array);
                    a = MuBitConverter.ReadFloat(array);
                    this.ColorProperties["_SpecColor"] = [r, g, b, a];
                    this.FloatProperties3["_Shininess"] = MuBitConverter.ReadFloat(array);
                    break;
                case MuEnum.ST_ALPHA_UNLIT:
                case MuEnum.ST_UNLIT:
                    this.TextureProperties["_MainTex"] = new MuMatTex(array);
                    r = MuBitConverter.ReadFloat(array);
                    g = MuBitConverter.ReadFloat(array);
                    b = MuBitConverter.ReadFloat(array);
                    a = MuBitConverter.ReadFloat(array);
                    this.ColorProperties["_Color"] = [r, g, b, a];
                    break;
                case MuEnum.ST_PARTICLES_ALPHA_BLENDED:
                case MuEnum.ST_PARTICLES_ADDITIVE:
                    this.TextureProperties["_MainTex"] = new MuMatTex(array);
                    r = MuBitConverter.ReadFloat(array);
                    g = MuBitConverter.ReadFloat(array);
                    b = MuBitConverter.ReadFloat(array);
                    a = MuBitConverter.ReadFloat(array);
                    this.ColorProperties["_Color"] = [r, g, b, a];
                    this.FloatProperties3["_InvFade"] = MuBitConverter.ReadFloat(array);
                    break;
                case MuEnum.ST_DIFFUSE:
                    this.TextureProperties["_MainTex"] = new MuMatTex(array);
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
        MuBitConverter.WriteString(data, this.Name);
        MuBitConverter.WriteString(data, this.ShaderName);
        MuBitConverter.WriteInt(data, PropertyCount);
        Object.getOwnPropertyNames(this.ColorProperties).forEach(prop => {
            MuBitConverter.WriteString(data, prop);
            MuBitConverter.WriteInt(data, MuEnum.PT_COLOR_PROPERTY);
            MuBitConverter.WriteFloat(data, this.ColorProperties[prop][0]);
            MuBitConverter.WriteFloat(data, this.ColorProperties[prop][1]);
            MuBitConverter.WriteFloat(data, this.ColorProperties[prop][2]);
            MuBitConverter.WriteFloat(data, this.ColorProperties[prop][3]);
        });
        Object.getOwnPropertyNames(this.VectorProperties).forEach(prop => {
            MuBitConverter.WriteString(data, prop);
            MuBitConverter.WriteInt(data, MuEnum.PT_VECTOR_PROPERTY);
            MuBitConverter.WriteFloat(data, this.VectorProperties[prop][0]);
            MuBitConverter.WriteFloat(data, this.VectorProperties[prop][1]);
            MuBitConverter.WriteFloat(data, this.VectorProperties[prop][2]);
            MuBitConverter.WriteFloat(data, this.VectorProperties[prop][3]);
        });
        Object.getOwnPropertyNames(this.FloatProperties2).forEach(prop => {
            MuBitConverter.WriteString(data, prop);
            MuBitConverter.WriteInt(data, MuEnum.PT_FLOAT_PROPERTY_2);
            MuBitConverter.WriteFloat(data, this.FloatProperties2[prop]);
        });
        Object.getOwnPropertyNames(this.FloatProperties3).forEach(prop => {
            MuBitConverter.WriteString(data, prop);
            MuBitConverter.WriteInt(data, MuEnum.PT_FLOAT_PROPERTY_3);
            MuBitConverter.WriteFloat(data, this.FloatProperties3[prop]);
        });
        Object.getOwnPropertyNames(this.TextureProperties).forEach(prop => {
            MuBitConverter.WriteString(data, prop);
            MuBitConverter.WriteInt(data, MuEnum.PT_TEXTURE_PROPERTY);
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
class MuMesh {
    constructor(array) {
        this.Vertices = [];
        this.UVs = [];
        this.UV2s = [];
        this.Normals = [];
        this.Tangents = [];
        this.BoneWeights = [];
        this.BindPoses = [];
        this.Submeshes = [];
        this.Colors = [];
        let start = MuBitConverter.ReadInt(array);
        if (start != MuEnum.ET_MESH_START) {
            console.error("This shouldn't happen. Is the mu file corrupted?");
            throw `Unexpected value spotted @${array.offset}`;
        }
        let VerticleCount = MuBitConverter.ReadInt(array);
        let SubmeshCount = MuBitConverter.ReadInt(array);
        MeshLoop: while (true) {
            let Type = MuBitConverter.ReadInt(array);
            switch (Type) {
                case MuEnum.ET_MESH_END:
                    break MeshLoop;
                case MuEnum.ET_MESH_VERTS:
                    for (let i = 0; i < VerticleCount; ++i) {
                        this.Vertices.push(MuBitConverter.ReadVector(array));
                    }
                    break;
                case MuEnum.ET_MESH_UV:
                    for (let i = 0; i < VerticleCount; ++i) {
                        let x = MuBitConverter.ReadFloat(array);
                        let y = MuBitConverter.ReadFloat(array);
                        this.UVs.push([x, y]);
                    }
                    break;
                case MuEnum.ET_MESH_UV2:
                    for (let i = 0; i < VerticleCount; ++i) {
                        let x = MuBitConverter.ReadFloat(array);
                        let y = MuBitConverter.ReadFloat(array);
                        this.UV2s.push([x, y]);
                    }
                    break;
                case MuEnum.ET_MESH_NORMALS:
                    for (let i = 0; i < VerticleCount; ++i) {
                        this.Normals.push(MuBitConverter.ReadVector(array));
                    }
                    break;
                case MuEnum.ET_MESH_TANGENTS:
                    for (let i = 0; i < VerticleCount; ++i) {
                        this.Tangents.push(MuBitConverter.ReadTangent(array));
                    }
                    break;
                case MuEnum.ET_MESH_BONE_WEIGHTS:
                    for (let i = 0; i < VerticleCount; ++i) {
                        this.BoneWeights.push(new MuBoneWeight(array));
                    }
                    break;
                case MuEnum.ET_MESH_BIND_POSES:
                    for (let i = 0; i < VerticleCount; ++i) {
                        let pose = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        for (let i = 0; i < 16; ++i) {
                            pose[i] = MuBitConverter.ReadFloat(array);
                        }
                        this.BindPoses.push(pose);
                    }
                    break;
                case MuEnum.ET_MESH_TRIANGLES:
                    let TriangleCount = MuBitConverter.ReadInt(array);
                    let Triangles = [];
                    if (TriangleCount % 3 != 0) {
                        console.warn("Is this guaranteed?");
                    }
                    for (let i = 0; i < TriangleCount / 3; ++i) {
                        let x = MuBitConverter.ReadInt(array);
                        let y = MuBitConverter.ReadInt(array);
                        let z = MuBitConverter.ReadInt(array);
                        if (x == 0) {
                            Triangles.push([x, z, y]);
                        }
                        else {
                            Triangles.push([z, y, x]);
                        }
                    }
                    this.Submeshes.push(Triangles);
                    break;
                case MuEnum.ET_MESH_VERTEX_COLORS:
                    for (let i = 0; i < VerticleCount; ++i) {
                        this.Colors.push(MuBitConverter.ReadColor(array));
                    }
                    break;
                default:
                    throw `Incorrect mesh value type: ${Type} @${array.offset}`;
            }
        }
    }
    Serialize(data) {
        MuBitConverter.WriteInt(data, MuEnum.ET_MESH_START);
        MuBitConverter.WriteInt(data, this.Vertices.length);
        MuBitConverter.WriteInt(data, this.Submeshes.length);
        MuBitConverter.WriteInt(data, MuEnum.ET_MESH_VERTS);
        this.Vertices.forEach(v => {
            MuBitConverter.WriteVector(data, v);
        });
        if (this.Vertices.length == this.UVs.length) {
            MuBitConverter.WriteInt(data, MuEnum.ET_MESH_UV);
            this.UVs.forEach(uv => {
                MuBitConverter.WriteFloat(data, uv[0]);
                MuBitConverter.WriteFloat(data, uv[1]);
            });
        }
        if (this.Vertices.length == this.UV2s.length) {
            MuBitConverter.WriteInt(data, MuEnum.ET_MESH_UV2);
            this.UV2s.forEach(uv2 => {
                MuBitConverter.WriteFloat(data, uv2[0]);
                MuBitConverter.WriteFloat(data, uv2[1]);
            });
        }
        if (this.Vertices.length == this.Normals.length) {
            MuBitConverter.WriteInt(data, MuEnum.ET_MESH_NORMALS);
            this.Normals.forEach(normal => {
                MuBitConverter.WriteVector(data, normal);
            });
        }
        if (this.Vertices.length == this.Tangents.length) {
            MuBitConverter.WriteInt(data, MuEnum.ET_MESH_TANGENTS);
            this.Tangents.forEach(tangent => {
                MuBitConverter.WriteTangent(data, tangent);
            });
        }
        if (this.Vertices.length == this.BoneWeights.length) {
            MuBitConverter.WriteInt(data, MuEnum.ET_MESH_BONE_WEIGHTS);
            this.BoneWeights.forEach(boneWeight => {
                boneWeight.Serialize(data);
            });
        }
        if (this.BindPoses.length > 0) {
            MuBitConverter.WriteInt(data, MuEnum.ET_MESH_BIND_POSES);
            MuBitConverter.WriteInt(data, this.BindPoses.length);
            this.BindPoses.forEach(pose => {
                for (let i = 0; i < 16; ++i) {
                    MuBitConverter.WriteFloat(data, pose[i]);
                }
            });
        }
        if (this.Vertices.length == this.Colors.length) {
            MuBitConverter.WriteInt(data, MuEnum.ET_MESH_VERTEX_COLORS);
            this.Colors.forEach(color => {
                MuBitConverter.WriteColor(data, color);
            });
        }
        this.Submeshes.forEach(submesh => {
            MuBitConverter.WriteInt(data, MuEnum.ET_MESH_TRIANGLES);
            MuBitConverter.WriteInt(data, submesh.length * 3);
            submesh.forEach(triangle => {
                let [x, z, y] = triangle;
                MuBitConverter.WriteInt(data, x);
                MuBitConverter.WriteInt(data, y);
                MuBitConverter.WriteInt(data, z);
            });
        });
        MuBitConverter.WriteInt(data, MuEnum.ET_MESH_END);
    }
}
class MuObject {
    constructor(array) {
        this.Materials = [];
        this.Textures = [];
        this.Children = [];
        this.Transform = new MuTransform(array);
        MainLoop: while (true) {
            let EntryType;
            try {
                EntryType = MuBitConverter.ReadInt(array);
            }
            catch (e) {
                break;
            }
            switch (EntryType) {
                case MuEnum.ET_CHILD_TRANSFORM_START:
                    this.Children.push(new MuObject(array));
                    break;
                case MuEnum.ET_CHILD_TRANSFORM_END:
                    break MainLoop;
                case MuEnum.ET_TAG_AND_LAYER:
                    this.TagAndLayer = new MuTagLayer(array);
                    break;
                case MuEnum.ET_MESH_COLLIDER:
                case MuEnum.ET_MESH_COLLIDER2:
                case MuEnum.ET_SPHERE_COLLIDER:
                case MuEnum.ET_SPHERE_COLLIDER2:
                case MuEnum.ET_CAPSULE_COLLIDER:
                case MuEnum.ET_CAPSULE_COLLIDER2:
                case MuEnum.ET_BOX_COLLIDER:
                case MuEnum.ET_BOX_COLLIDER2:
                case MuEnum.ET_WHEEL_COLLIDER:
                    this.Collider = MuCollider.GetCollider(array, EntryType);
                    break;
                case MuEnum.ET_MESH_FILTER:
                    this.SharedMesh = new MuMesh(array);
                    break;
                case MuEnum.ET_MESH_RENDERER:
                    this.Renderer = new MuRenderer(array);
                    break;
                case MuEnum.ET_SKINNED_MESH_RENDERER:
                    this.SkinnedMeshRenderer = new MuSkinnedMeshRenderer(array);
                    break;
                case MuEnum.ET_ANIMATION:
                    this.Animation = new MuAnimation(array);
                    break;
                case MuEnum.ET_CAMERA:
                    this.Camera = new MuCamera(array);
                    break;
                case MuEnum.ET_PARTICLES:
                    this.Particles = new MuParticles(array);
                    break;
                case MuEnum.ET_LIGHT:
                    this.Light = new MuLight(array);
                    break;
                case MuEnum.ET_MATERIALS:
                    let MaterialCount = MuBitConverter.ReadInt(array);
                    for (let i = 0; i < MaterialCount; ++i) {
                        this.Materials.push(new MuMaterial(array));
                    }
                    break;
                case MuEnum.ET_TEXTURES:
                    let TextureCount = MuBitConverter.ReadInt(array);
                    for (let i = 0; i < TextureCount; ++i) {
                        this.Textures.push(new MuTexture(array));
                    }
                    break;
                default:
                    console.warn(`Unknown entry type: ${EntryType} @${array.offset}`);
                    break;
            }
        }
    }
    Serialize(data) {
        this.Transform.Serialize(data);
        if (this.TagAndLayer) {
            this.TagAndLayer.Serialize(data);
        }
        else {
            console.error("Here");
            throw `Tag & Layer should always exist on a MU object`;
        }
        if (this.Collider) {
            this.Collider.Serialize(data);
        }
        if (this.SharedMesh) {
            MuBitConverter.WriteInt(data, MuEnum.ET_MESH_FILTER);
            this.SharedMesh.Serialize(data);
        }
        if (this.Renderer) {
            this.Renderer.Serialize(data);
        }
        if (this.SkinnedMeshRenderer) {
            this.SkinnedMeshRenderer.Serialize(data);
        }
        if (this.Animation) {
            this.Animation.Serialize(data);
        }
        if (this.Camera) {
            this.Camera.Serialize(data);
        }
        if (this.Light) {
            this.Light.Serialize(data);
        }
        this.Children.forEach(child => {
            MuBitConverter.WriteInt(data, MuEnum.ET_CHILD_TRANSFORM_START);
            child.Serialize(data);
            MuBitConverter.WriteInt(data, MuEnum.ET_CHILD_TRANSFORM_END);
        });
        if (this.Materials.length > 0) {
            MuBitConverter.WriteInt(data, MuEnum.ET_MATERIALS);
            MuBitConverter.WriteInt(data, this.Materials.length);
            this.Materials.forEach(material => {
                material.Serialize(data);
            });
        }
        if (this.Textures.length > 0) {
            MuBitConverter.WriteInt(data, MuEnum.ET_TEXTURES);
            MuBitConverter.WriteInt(data, this.Textures.length);
            this.Textures.forEach(texture => {
                texture.Serialize(data);
            });
        }
    }
}
class MuParticles {
    constructor(array) {
        this.Shape2D = [0, 0];
        this.Color = [0, 0, 0, 0];
        this.Size = [0, 0];
        this.Energy = [0, 0];
        this.Emission = [0, 0];
        this.ColorAnimation = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        this.UVAnimation = [0, 0, 0];
        this.Emit = MuBitConverter.ReadByte(array);
        this.Shape = MuBitConverter.ReadInt(array);
        this.Shape3D = MuBitConverter.ReadVector(array);
        this.Shape2D[0] = MuBitConverter.ReadFloat(array);
        this.Shape2D[1] = MuBitConverter.ReadFloat(array);
        this.Shape1D = MuBitConverter.ReadFloat(array);
        this.Color[0] = MuBitConverter.ReadFloat(array);
        this.Color[1] = MuBitConverter.ReadFloat(array);
        this.Color[2] = MuBitConverter.ReadFloat(array);
        this.Color[3] = MuBitConverter.ReadFloat(array);
        this.UseWorldSpace = MuBitConverter.ReadByte(array);
        this.Size[0] = MuBitConverter.ReadFloat(array);
        this.Size[1] = MuBitConverter.ReadFloat(array);
        this.Energy[0] = MuBitConverter.ReadFloat(array);
        this.Energy[1] = MuBitConverter.ReadFloat(array);
        this.Emission[0] = MuBitConverter.ReadInt(array);
        this.Emission[1] = MuBitConverter.ReadInt(array);
        this.WorldVelocity = MuBitConverter.ReadVector(array);
        this.LocalVelocity = MuBitConverter.ReadVector(array);
        this.RandomVelocity = MuBitConverter.ReadVector(array);
        this.EmitterVelocityScale = MuBitConverter.ReadFloat(array);
        this.AngularVelocity = MuBitConverter.ReadFloat(array);
        this.RandomAngularVelocity = MuBitConverter.ReadFloat(array);
        this.RandomRotation = MuBitConverter.ReadByte(array);
        this.DoesAnimateColor = MuBitConverter.ReadByte(array);
        for (let i = 0; i < 5; ++i) {
            for (let j = 0; j < 4; ++j) {
                this.ColorAnimation[i][j] = MuBitConverter.ReadFloat(array);
            }
        }
        this.WorldRotationAxis = MuBitConverter.ReadVector(array);
        this.LocalRotationAxis = MuBitConverter.ReadVector(array);
        this.SizeGrow = MuBitConverter.ReadFloat(array);
        this.RandomForce = MuBitConverter.ReadVector(array);
        this.Force = MuBitConverter.ReadVector(array);
        this.Damping = MuBitConverter.ReadFloat(array);
        this.CastShadows = MuBitConverter.ReadByte(array);
        this.ReceiveShadows = MuBitConverter.ReadByte(array);
        this.LengthScale = MuBitConverter.ReadFloat(array);
        this.VelocityScale = MuBitConverter.ReadFloat(array);
        this.MaxParticleSize = MuBitConverter.ReadFloat(array);
        this.ParticleRenderMode = MuBitConverter.ReadInt(array);
        this.UVAnimation[0] = MuBitConverter.ReadInt(array);
        this.UVAnimation[1] = MuBitConverter.ReadInt(array);
        this.UVAnimation[2] = MuBitConverter.ReadInt(array);
        this.Count = MuBitConverter.ReadInt(array);
    }
    Serialize(data) {
        MuBitConverter.WriteByte(data, this.Emit);
        MuBitConverter.WriteInt(data, this.Shape);
        MuBitConverter.WriteVector(data, this.Shape3D);
        MuBitConverter.WriteFloat(data, this.Shape2D[0]);
        MuBitConverter.WriteFloat(data, this.Shape2D[1]);
        MuBitConverter.WriteFloat(data, this.Shape1D);
        MuBitConverter.WriteFloat(data, this.Color[0]);
        MuBitConverter.WriteFloat(data, this.Color[1]);
        MuBitConverter.WriteFloat(data, this.Color[2]);
        MuBitConverter.WriteFloat(data, this.Color[3]);
        MuBitConverter.WriteByte(data, this.UseWorldSpace);
        MuBitConverter.WriteFloat(data, this.Size[0]);
        MuBitConverter.WriteFloat(data, this.Size[1]);
        MuBitConverter.WriteFloat(data, this.Energy[0]);
        MuBitConverter.WriteFloat(data, this.Energy[1]);
        MuBitConverter.WriteInt(data, this.Emission[0]);
        MuBitConverter.WriteInt(data, this.Emission[1]);
        MuBitConverter.WriteVector(data, this.WorldVelocity);
        MuBitConverter.WriteVector(data, this.LocalVelocity);
        MuBitConverter.WriteVector(data, this.RandomVelocity);
        MuBitConverter.WriteFloat(data, this.EmitterVelocityScale);
        MuBitConverter.WriteFloat(data, this.AngularVelocity);
        MuBitConverter.WriteFloat(data, this.RandomAngularVelocity);
        MuBitConverter.WriteByte(data, this.RandomRotation);
        MuBitConverter.WriteByte(data, this.DoesAnimateColor);
        this.ColorAnimation.forEach(color => {
            color.forEach(c => {
                MuBitConverter.WriteFloat(data, c);
            });
        });
        MuBitConverter.WriteVector(data, this.WorldRotationAxis);
        MuBitConverter.WriteVector(data, this.LocalRotationAxis);
        MuBitConverter.WriteFloat(data, this.SizeGrow);
        MuBitConverter.WriteVector(data, this.RandomForce);
        MuBitConverter.WriteVector(data, this.Force);
        MuBitConverter.WriteFloat(data, this.Damping);
        MuBitConverter.WriteByte(data, this.CastShadows);
        MuBitConverter.WriteByte(data, this.ReceiveShadows);
        MuBitConverter.WriteFloat(data, this.LengthScale);
        MuBitConverter.WriteFloat(data, this.VelocityScale);
        MuBitConverter.WriteFloat(data, this.MaxParticleSize);
        MuBitConverter.WriteInt(data, this.ParticleRenderMode);
        MuBitConverter.WriteInt(data, this.UVAnimation[0]);
        MuBitConverter.WriteInt(data, this.UVAnimation[1]);
        MuBitConverter.WriteInt(data, this.UVAnimation[2]);
        MuBitConverter.WriteInt(data, this.Count);
    }
}
class MuRenderer {
    constructor(array) {
        this.CastShadows = 1;
        this.ReceiveShadows = 1;
        this.Materials = [];
        if (array.version > 0) {
            this.CastShadows = MuBitConverter.ReadByte(array);
            this.ReceiveShadows = MuBitConverter.ReadByte(array);
        }
        let MaterialCount = MuBitConverter.ReadInt(array);
        for (let i = 0; i < MaterialCount; ++i) {
            this.Materials.push(MuBitConverter.ReadInt(array));
        }
    }
    Serialize(data) {
        MuBitConverter.WriteInt(data, MuEnum.ET_MESH_RENDERER);
        MuBitConverter.WriteByte(data, this.CastShadows);
        MuBitConverter.WriteByte(data, this.ReceiveShadows);
        MuBitConverter.WriteInt(data, this.Materials.length);
        this.Materials.forEach(material => {
            MuBitConverter.WriteInt(data, material);
        });
    }
}
class MuSkinnedMeshRenderer {
    constructor(array) {
        this.Materials = [];
        this.Bones = [];
        let MaterialCount = MuBitConverter.ReadInt(array);
        for (let i = 0; i < MaterialCount; ++i) {
            this.Materials.push(MuBitConverter.ReadInt(array));
        }
        this.Center = MuBitConverter.ReadVector(array);
        this.Size = MuBitConverter.ReadVector(array);
        this.Quality = MuBitConverter.ReadInt(array);
        this.UpdateWhenOffscreen = MuBitConverter.ReadByte(array);
        let BoneCount = MuBitConverter.ReadInt(array);
        for (let i = 0; i < BoneCount; ++i) {
            this.Bones.push(MuBitConverter.ReadString(array));
        }
        this.Mesh = new MuMesh(array);
    }
    Serialize(data) {
        MuBitConverter.WriteInt(data, MuEnum.ET_SKINNED_MESH_RENDERER);
        MuBitConverter.WriteInt(data, this.Materials.length);
        this.Materials.forEach(material => {
            MuBitConverter.WriteInt(data, material);
        });
        MuBitConverter.WriteVector(data, this.Center);
        MuBitConverter.WriteVector(data, this.Size);
        MuBitConverter.WriteInt(data, this.Quality);
        MuBitConverter.WriteByte(data, this.UpdateWhenOffscreen);
        MuBitConverter.WriteInt(data, this.Bones.length);
        this.Bones.forEach(bone => {
            MuBitConverter.WriteString(data, bone);
        });
        this.Mesh.Serialize(data);
    }
}
class MuSpring {
    constructor(array) {
        this.Spring = MuBitConverter.ReadFloat(array);
        this.Damper = MuBitConverter.ReadFloat(array);
        this.TargetPosition = MuBitConverter.ReadFloat(array);
    }
    Serialize(data) {
        MuBitConverter.WriteFloat(data, this.Spring);
        MuBitConverter.WriteFloat(data, this.Damper);
        MuBitConverter.WriteFloat(data, this.TargetPosition);
    }
}
class MuTagLayer {
    constructor(array) {
        this.Tag = MuBitConverter.ReadString(array);
        this.Layer = MuBitConverter.ReadInt(array);
    }
    Serialize(data) {
        MuBitConverter.WriteInt(data, MuEnum.ET_TAG_AND_LAYER);
        MuBitConverter.WriteString(data, this.Tag);
        MuBitConverter.WriteInt(data, this.Layer);
    }
}
class MuTexture {
    constructor(array) {
        this.Name = MuBitConverter.ReadString(array);
        this.Type = MuBitConverter.ReadInt(array);
    }
    Serialize(data) {
        MuBitConverter.WriteString(data, this.Name);
        MuBitConverter.WriteInt(data, this.Type);
    }
}
class MuTransform {
    constructor(array) {
        this.Name = MuBitConverter.ReadString(array);
        this.LocalPosition = MuBitConverter.ReadVector(array);
        this.LocalRotation = MuBitConverter.ReadQuaternion(array);
        this.LocalScale = MuBitConverter.ReadVector(array);
    }
    Serialize(data) {
        MuBitConverter.WriteString(data, this.Name);
        MuBitConverter.WriteVector(data, this.LocalPosition);
        MuBitConverter.WriteQuaternion(data, this.LocalRotation);
        MuBitConverter.WriteVector(data, this.LocalScale);
    }
}
class MuCollider {
    static GetCollider(array, colliderType) {
        switch (colliderType) {
            case MuEnum.ET_MESH_COLLIDER:
                return new MuColliderMesh(array, false);
            case MuEnum.ET_MESH_COLLIDER2:
                return new MuColliderMesh(array, true);
            case MuEnum.ET_SPHERE_COLLIDER:
                return new MuColliderSphere(array, false);
            case MuEnum.ET_SPHERE_COLLIDER2:
                return new MuColliderSphere(array, true);
            case MuEnum.ET_CAPSULE_COLLIDER:
                return new MuColliderCapsule(array, false);
            case MuEnum.ET_CAPSULE_COLLIDER2:
                return new MuColliderCapsule(array, true);
            case MuEnum.ET_BOX_COLLIDER:
                return new MuColliderBox(array, false);
            case MuEnum.ET_BOX_COLLIDER2:
                return new MuColliderBox(array, true);
            case MuEnum.ET_WHEEL_COLLIDER:
                return new MuColliderWheel(array);
            default:
                throw `Unknown collider type ${colliderType} @${array.offset}`;
        }
    }
    Serialize(data) { }
    ;
}
class MuColliderBox {
    constructor(array, isTwo) {
        this.IsTrigger = 0;
        this.HasTrigger = isTwo;
        if (this.HasTrigger) {
            this.IsTrigger = MuBitConverter.ReadByte(array);
        }
        this.Size = MuBitConverter.ReadVector(array);
        this.Center = MuBitConverter.ReadVector(array);
    }
    Serialize(data) {
        if (this.HasTrigger) {
            MuBitConverter.WriteInt(data, MuEnum.ET_BOX_COLLIDER2);
            MuBitConverter.WriteByte(data, this.IsTrigger);
        }
        else {
            MuBitConverter.WriteInt(data, MuEnum.ET_BOX_COLLIDER);
        }
        MuBitConverter.WriteVector(data, this.Size);
        MuBitConverter.WriteVector(data, this.Center);
    }
}
class MuColliderCapsule {
    constructor(array, isTwo) {
        this.IsTrigger = 0;
        this.HasTrigger = isTwo;
        if (this.HasTrigger) {
            this.IsTrigger = MuBitConverter.ReadByte(array);
        }
        this.Radius = MuBitConverter.ReadFloat(array);
        this.Height = MuBitConverter.ReadFloat(array);
        this.Direction = MuBitConverter.ReadInt(array);
        this.Center = MuBitConverter.ReadVector(array);
    }
    Serialize(data) {
        if (this.HasTrigger) {
            MuBitConverter.WriteInt(data, MuEnum.ET_CAPSULE_COLLIDER2);
            MuBitConverter.WriteByte(data, this.IsTrigger);
        }
        else {
            MuBitConverter.WriteInt(data, MuEnum.ET_CAPSULE_COLLIDER);
        }
        MuBitConverter.WriteFloat(data, this.Radius);
        MuBitConverter.WriteFloat(data, this.Height);
        MuBitConverter.WriteInt(data, this.Direction);
        MuBitConverter.WriteVector(data, this.Center);
    }
}
class MuColliderMesh {
    constructor(array, isTwo) {
        this.IsTrigger = 0;
        this.HasTrigger = isTwo;
        if (this.HasTrigger) {
            this.IsTrigger = MuBitConverter.ReadByte(array);
        }
        this.Convex = MuBitConverter.ReadByte(array);
        this.Mesh = new MuMesh(array);
    }
    Serialize(data) {
        if (this.HasTrigger) {
            MuBitConverter.WriteInt(data, MuEnum.ET_MESH_COLLIDER2);
            MuBitConverter.WriteByte(data, this.IsTrigger);
        }
        else {
            MuBitConverter.WriteInt(data, MuEnum.ET_MESH_COLLIDER);
        }
        MuBitConverter.WriteByte(data, this.Convex);
        this.Mesh.Serialize(data);
    }
}
class MuColliderSphere {
    constructor(array, isTwo) {
        this.IsTrigger = 0;
        this.HasTrigger = isTwo;
        if (this.HasTrigger) {
            this.IsTrigger = MuBitConverter.ReadByte(array);
        }
        this.Radius = MuBitConverter.ReadFloat(array);
        this.Center = MuBitConverter.ReadVector(array);
    }
    Serialize(data) {
        if (this.HasTrigger) {
            MuBitConverter.WriteInt(data, MuEnum.ET_SPHERE_COLLIDER2);
            MuBitConverter.WriteByte(data, this.IsTrigger);
        }
        else {
            MuBitConverter.WriteInt(data, MuEnum.ET_SPHERE_COLLIDER);
        }
        MuBitConverter.WriteFloat(data, this.Radius);
        MuBitConverter.WriteVector(data, this.Center);
    }
}
class MuColliderWheel {
    constructor(array) {
        this.Mass = MuBitConverter.ReadFloat(array);
        this.Radius = MuBitConverter.ReadFloat(array);
        this.SuspensionDistance = MuBitConverter.ReadFloat(array);
        this.Center = MuBitConverter.ReadVector(array);
        this.SuspensionSpring = new MuSpring(array);
        this.ForwardFriction = new MuFriction(array);
        this.SidewaysFriction = new MuFriction(array);
    }
    Serialize(data) {
        MuBitConverter.WriteInt(data, MuEnum.ET_WHEEL_COLLIDER);
        MuBitConverter.WriteFloat(data, this.Mass);
        MuBitConverter.WriteFloat(data, this.Radius);
        MuBitConverter.WriteFloat(data, this.SuspensionDistance);
        MuBitConverter.WriteVector(data, this.Center);
        this.SuspensionSpring.Serialize(data);
        this.ForwardFriction.Serialize(data);
        this.SidewaysFriction.Serialize(data);
    }
}
//# sourceMappingURL=muTS.js.map