import IMuBinary from "./IMuBinary";
import MuClip from "./MuClip";
export default class MuAnimation {
    Clips: MuClip[];
    ClipName: string;
    Autoplay: number;
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
//# sourceMappingURL=MuAnimation.d.ts.map