import IMuBinary from "../IMuBinary";
export default class MuColliderBox {
    HasTrigger: boolean;
    IsTrigger: number;
    Size: [number, number, number];
    Center: [number, number, number];
    constructor(array: IMuBinary, isTwo: boolean);
    Serialize(data: number[]): void;
}
//# sourceMappingURL=MuColliderBox.d.ts.map