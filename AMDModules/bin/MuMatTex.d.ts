import IMuBinary from "./IMuBinary";
export default class MuMatTex {
    Index: number;
    Scale: [number, number];
    Offset: [number, number];
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
//# sourceMappingURL=MuMatTex.d.ts.map