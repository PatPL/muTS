import MuObject from "./MuObject";
export default class Mu {
    Magic: number;
    Version: number;
    Name: string;
    Object: MuObject;
    constructor(data: Uint8Array);
    Serialize(): Uint8Array;
}
//# sourceMappingURL=Mu.d.ts.map