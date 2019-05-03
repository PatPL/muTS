import IMuBinary from "./IMuBinary";
export default class MuKey {
    Time: number;
    Value: number;
    Tangent: [number, number];
    TangentMode: number;
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
//# sourceMappingURL=MuKey.d.ts.map