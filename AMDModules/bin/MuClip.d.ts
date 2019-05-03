import IMuBinary from "./IMuBinary";
import MuCurve from "./MuCurve";
export default class MuClip {
    Curves: MuCurve[];
    Name: string;
    lbCenter: [number, number, number];
    lbSize: [number, number, number];
    WrapMode: number;
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
//# sourceMappingURL=MuClip.d.ts.map