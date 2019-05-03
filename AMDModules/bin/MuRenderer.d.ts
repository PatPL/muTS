import IMuBinary from "./IMuBinary";
export default class MuRenderer {
    CastShadows: number;
    ReceiveShadows: number;
    Materials: number[];
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
//# sourceMappingURL=MuRenderer.d.ts.map