define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MuBitConverter {
        static ReadByte(array) {
            if (array.data.length < array.offset + 1) {
                throw `Premature EOF @${array.offset} in ReadByte`;
            }
            return array.data[array.offset++];
        }
        static ReadInt(array) {
            if (array.data.length < array.offset + 4) {
                throw `Premature EOF @${array.offset} in ReadInt`;
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
                throw `Premature EOF @${array.offset} in ReadUInt`;
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
            if (array.data.length < array.offset + 4) {
                throw `Premature EOF @${array.offset} in ReadColor`;
            }
            let r = array.data[array.offset++] / 255;
            let g = array.data[array.offset++] / 255;
            let b = array.data[array.offset++] / 255;
            let a = array.data[array.offset++] / 255;
            return [r, g, b, a];
        }
        static ReadBytes(array, length) {
            if (array.data.length < array.offset + length) {
                throw `Premature EOF @${array.offset} in ReadBytes`;
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
    exports.default = MuBitConverter;
});
//# sourceMappingURL=MuBitConverter.js.map