import IMuBinary from "./IMuBinary";
export default class MuCamera {
    ClearFlags: number;
    BackgroundColor: [number, number, number, number];
    CullingMask: number;
    Orthographic: number;
    FOV: number;
    Near: number;
    Far: number;
    Depth: number;
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
//# sourceMappingURL=MuCamera.d.ts.map