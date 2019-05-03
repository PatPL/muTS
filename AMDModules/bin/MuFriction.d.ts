import IMuBinary from "./IMuBinary";
export default class MuFriction {
    ExtremumSlip: number;
    ExtremumValue: number;
    AsymptoteSlip: number;
    AsymptoteValue: number;
    Stiffness: number;
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
//# sourceMappingURL=MuFriction.d.ts.map