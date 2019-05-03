var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "../MuBitConverter", "../MuEnum", "../MuSpring", "../MuFriction"], function (require, exports, MuBitConverter_1, MuEnum_1, MuSpring_1, MuFriction_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    MuBitConverter_1 = __importDefault(MuBitConverter_1);
    MuSpring_1 = __importDefault(MuSpring_1);
    MuFriction_1 = __importDefault(MuFriction_1);
    class MuColliderWheel {
        constructor(array) {
            this.Mass = MuBitConverter_1.default.ReadFloat(array);
            this.Radius = MuBitConverter_1.default.ReadFloat(array);
            this.SuspensionDistance = MuBitConverter_1.default.ReadFloat(array);
            this.Center = MuBitConverter_1.default.ReadVector(array);
            this.SuspensionSpring = new MuSpring_1.default(array);
            this.ForwardFriction = new MuFriction_1.default(array);
            this.SidewaysFriction = new MuFriction_1.default(array);
        }
        Serialize(data) {
            MuBitConverter_1.default.WriteInt(data, MuEnum_1.MuEnum.ET_WHEEL_COLLIDER);
            MuBitConverter_1.default.WriteFloat(data, this.Mass);
            MuBitConverter_1.default.WriteFloat(data, this.Radius);
            MuBitConverter_1.default.WriteFloat(data, this.SuspensionDistance);
            MuBitConverter_1.default.WriteVector(data, this.Center);
            this.SuspensionSpring.Serialize(data);
            this.ForwardFriction.Serialize(data);
            this.SidewaysFriction.Serialize(data);
        }
    }
    exports.default = MuColliderWheel;
});
//# sourceMappingURL=MuColliderWheel.js.map