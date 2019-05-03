import MuSpring from "../MuSpring";
import MuFriction from "../MuFriction";
import IMuBinary from "../IMuBinary";
export default class MuColliderWheel {
    Mass: number;
    Radius: number;
    SuspensionDistance: number;
    Center: [number, number, number];
    SuspensionSpring: MuSpring;
    ForwardFriction: MuFriction;
    SidewaysFriction: MuFriction;
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
//# sourceMappingURL=MuColliderWheel.d.ts.map