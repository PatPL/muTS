import IMuBinary from "./IMuBinary";
import MuMatTex from "./MuMatTex";
export default class MuMaterial {
    static readonly ShaderNames: string[];
    ColorProperties: {
        [property: string]: [number, number, number, number];
    };
    VectorProperties: {
        [property: string]: [number, number, number, number];
    };
    FloatProperties2: {
        [property: string]: number;
    };
    FloatProperties3: {
        [property: string]: number;
    };
    TextureProperties: {
        [property: string]: MuMatTex;
    };
    Name: string;
    ShaderName: string;
    constructor(array: IMuBinary);
    Serialize(data: number[]): void;
}
//# sourceMappingURL=MuMaterial.d.ts.map