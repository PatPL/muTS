import IMuBinary from "./IMuBinary";
import MuKey from "./MuKey";
export default class MuCurve {
    Path: string;
    Property: string;
    Type: number;
    WrapMode: [number, number];
    Keys: MuKey[];
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
//# sourceMappingURL=MuCurve.d.ts.map