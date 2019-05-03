import IMuBinary from "./IMuBinary";
export default class MuBitConverter {
    static ReadByte(array: IMuBinary): number;
    static ReadInt(array: IMuBinary): number;
    static Read7Int(array: IMuBinary): number;
    static ReadUInt(array: IMuBinary): number;
    static ReadFloat(array: IMuBinary): number;
    static ReadVector(array: IMuBinary): [number, number, number];
    static ReadQuaternion(array: IMuBinary): [number, number, number, number];
    static ReadTangent(array: IMuBinary): [number, number, number, number];
    static ReadColor(array: IMuBinary): [number, number, number, number];
    static ReadBytes(array: IMuBinary, length: number): Uint8Array;
    static ReadString(array: IMuBinary): string;
    static WriteByte(data: number[], value: number): void;
    static WriteInt(data: number[], value: number): void;
    static Write7Int(data: number[], value: number): void;
    static WriteUInt(data: number[], value: number): void;
    static WriteFloat(data: number[], value: number): void;
    static WriteVector(data: number[], value: [number, number, number]): void;
    static WriteQuaternion(data: number[], value: [number, number, number, number]): void;
    static WriteTangent(data: number[], value: [number, number, number, number]): void;
    static WriteColor(data: number[], value: [number, number, number, number]): void;
    static WriteBytes(data: number[], value: Uint8Array): void;
    static WriteString(data: number[], value: string): void;
}
//# sourceMappingURL=MuBitConverter.d.ts.map