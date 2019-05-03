import IMuBinary from "../IMuBinary";
export default class MuColliderCapsule {
    HasTrigger: boolean;
    IsTrigger: number;
    Radius: number;
    Height: number;
    Direction: number;
    Center: [number, number, number];
    constructor(array: IMuBinary, isTwo: boolean);
    Serialize(data: number[]): void;
}
//# sourceMappingURL=MuColliderCapsule.d.ts.map