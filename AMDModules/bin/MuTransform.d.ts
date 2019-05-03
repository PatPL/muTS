import IMuBinary from "./IMuBinary";
export default class MuTransform {
    Name: string;
    LocalPosition: [number, number, number];
    LocalRotation: [number, number, number, number];
    LocalScale: [number, number, number];
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
//# sourceMappingURL=MuTransform.d.ts.map