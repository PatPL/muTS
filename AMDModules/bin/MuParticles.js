var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./MuBitConverter"], function (require, exports, MuBitConverter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    MuBitConverter_1 = __importDefault(MuBitConverter_1);
    class MuParticles {
        constructor(array) {
            this.Shape2D = [0, 0];
            this.Color = [0, 0, 0, 0];
            this.Size = [0, 0];
            this.Energy = [0, 0];
            this.Emission = [0, 0];
            this.ColorAnimation = [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
            this.UVAnimation = [0, 0, 0];
            if (window.muTSlog) {
                console.log(`Reading MuParticles @${array.offset}`);
            }
            ;
            this.Emit = MuBitConverter_1.default.ReadByte(array);
            this.Shape = MuBitConverter_1.default.ReadInt(array);
            this.Shape3D = MuBitConverter_1.default.ReadVector(array);
            this.Shape2D[0] = MuBitConverter_1.default.ReadFloat(array);
            this.Shape2D[1] = MuBitConverter_1.default.ReadFloat(array);
            this.Shape1D = MuBitConverter_1.default.ReadFloat(array);
            this.Color[0] = MuBitConverter_1.default.ReadFloat(array);
            this.Color[1] = MuBitConverter_1.default.ReadFloat(array);
            this.Color[2] = MuBitConverter_1.default.ReadFloat(array);
            this.Color[3] = MuBitConverter_1.default.ReadFloat(array);
            this.UseWorldSpace = MuBitConverter_1.default.ReadByte(array);
            this.Size[0] = MuBitConverter_1.default.ReadFloat(array);
            this.Size[1] = MuBitConverter_1.default.ReadFloat(array);
            this.Energy[0] = MuBitConverter_1.default.ReadFloat(array);
            this.Energy[1] = MuBitConverter_1.default.ReadFloat(array);
            this.Emission[0] = MuBitConverter_1.default.ReadInt(array);
            this.Emission[1] = MuBitConverter_1.default.ReadInt(array);
            this.WorldVelocity = MuBitConverter_1.default.ReadVector(array);
            this.LocalVelocity = MuBitConverter_1.default.ReadVector(array);
            this.RandomVelocity = MuBitConverter_1.default.ReadVector(array);
            this.EmitterVelocityScale = MuBitConverter_1.default.ReadFloat(array);
            this.AngularVelocity = MuBitConverter_1.default.ReadFloat(array);
            this.RandomAngularVelocity = MuBitConverter_1.default.ReadFloat(array);
            this.RandomRotation = MuBitConverter_1.default.ReadByte(array);
            this.DoesAnimateColor = MuBitConverter_1.default.ReadByte(array);
            for (let i = 0; i < 5; ++i) {
                for (let j = 0; j < 4; ++j) {
                    this.ColorAnimation[i][j] = MuBitConverter_1.default.ReadFloat(array);
                }
            }
            this.WorldRotationAxis = MuBitConverter_1.default.ReadVector(array);
            this.LocalRotationAxis = MuBitConverter_1.default.ReadVector(array);
            this.SizeGrow = MuBitConverter_1.default.ReadFloat(array);
            this.RandomForce = MuBitConverter_1.default.ReadVector(array);
            this.Force = MuBitConverter_1.default.ReadVector(array);
            this.Damping = MuBitConverter_1.default.ReadFloat(array);
            this.CastShadows = MuBitConverter_1.default.ReadByte(array);
            this.ReceiveShadows = MuBitConverter_1.default.ReadByte(array);
            this.LengthScale = MuBitConverter_1.default.ReadFloat(array);
            this.VelocityScale = MuBitConverter_1.default.ReadFloat(array);
            this.MaxParticleSize = MuBitConverter_1.default.ReadFloat(array);
            this.ParticleRenderMode = MuBitConverter_1.default.ReadInt(array);
            this.UVAnimation[0] = MuBitConverter_1.default.ReadInt(array);
            this.UVAnimation[1] = MuBitConverter_1.default.ReadInt(array);
            this.UVAnimation[2] = MuBitConverter_1.default.ReadInt(array);
            this.Count = MuBitConverter_1.default.ReadInt(array);
        }
        Serialize(data) {
            MuBitConverter_1.default.WriteByte(data, this.Emit);
            MuBitConverter_1.default.WriteInt(data, this.Shape);
            MuBitConverter_1.default.WriteVector(data, this.Shape3D);
            MuBitConverter_1.default.WriteFloat(data, this.Shape2D[0]);
            MuBitConverter_1.default.WriteFloat(data, this.Shape2D[1]);
            MuBitConverter_1.default.WriteFloat(data, this.Shape1D);
            MuBitConverter_1.default.WriteFloat(data, this.Color[0]);
            MuBitConverter_1.default.WriteFloat(data, this.Color[1]);
            MuBitConverter_1.default.WriteFloat(data, this.Color[2]);
            MuBitConverter_1.default.WriteFloat(data, this.Color[3]);
            MuBitConverter_1.default.WriteByte(data, this.UseWorldSpace);
            MuBitConverter_1.default.WriteFloat(data, this.Size[0]);
            MuBitConverter_1.default.WriteFloat(data, this.Size[1]);
            MuBitConverter_1.default.WriteFloat(data, this.Energy[0]);
            MuBitConverter_1.default.WriteFloat(data, this.Energy[1]);
            MuBitConverter_1.default.WriteInt(data, this.Emission[0]);
            MuBitConverter_1.default.WriteInt(data, this.Emission[1]);
            MuBitConverter_1.default.WriteVector(data, this.WorldVelocity);
            MuBitConverter_1.default.WriteVector(data, this.LocalVelocity);
            MuBitConverter_1.default.WriteVector(data, this.RandomVelocity);
            MuBitConverter_1.default.WriteFloat(data, this.EmitterVelocityScale);
            MuBitConverter_1.default.WriteFloat(data, this.AngularVelocity);
            MuBitConverter_1.default.WriteFloat(data, this.RandomAngularVelocity);
            MuBitConverter_1.default.WriteByte(data, this.RandomRotation);
            MuBitConverter_1.default.WriteByte(data, this.DoesAnimateColor);
            this.ColorAnimation.forEach(color => {
                color.forEach(c => {
                    MuBitConverter_1.default.WriteFloat(data, c);
                });
            });
            MuBitConverter_1.default.WriteVector(data, this.WorldRotationAxis);
            MuBitConverter_1.default.WriteVector(data, this.LocalRotationAxis);
            MuBitConverter_1.default.WriteFloat(data, this.SizeGrow);
            MuBitConverter_1.default.WriteVector(data, this.RandomForce);
            MuBitConverter_1.default.WriteVector(data, this.Force);
            MuBitConverter_1.default.WriteFloat(data, this.Damping);
            MuBitConverter_1.default.WriteByte(data, this.CastShadows);
            MuBitConverter_1.default.WriteByte(data, this.ReceiveShadows);
            MuBitConverter_1.default.WriteFloat(data, this.LengthScale);
            MuBitConverter_1.default.WriteFloat(data, this.VelocityScale);
            MuBitConverter_1.default.WriteFloat(data, this.MaxParticleSize);
            MuBitConverter_1.default.WriteInt(data, this.ParticleRenderMode);
            MuBitConverter_1.default.WriteInt(data, this.UVAnimation[0]);
            MuBitConverter_1.default.WriteInt(data, this.UVAnimation[1]);
            MuBitConverter_1.default.WriteInt(data, this.UVAnimation[2]);
            MuBitConverter_1.default.WriteInt(data, this.Count);
        }
    }
    exports.default = MuParticles;
});
//# sourceMappingURL=MuParticles.js.map