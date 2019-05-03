import IMuBinary from "./IMuBinary";
export default class MuLight {
    Type: number;
    Intensity: number;
    Range: number;
    Color: [number, number, number, number];
    CullingMask: number;
    SpotAngle: number;
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
//# sourceMappingURL=MuLight.d.ts.map