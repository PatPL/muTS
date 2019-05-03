import IMuBinary from "../IMuBinary";
export default class MuColliderSphere {
    HasTrigger: boolean;
    IsTrigger: number;
    Radius: number;
    Center: [number, number, number];
    constructor(array: IMuBinary, isTwo: boolean);
    Serialize(data: number[]): void;
}
//# sourceMappingURL=MuColliderSphere.d.ts.map