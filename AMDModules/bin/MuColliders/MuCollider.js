var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./MuColliderMesh", "../MuEnum", "./MuColliderSphere", "./MuColliderCapsule", "./MuColliderBox", "./MuColliderWheel"], function (require, exports, MuColliderMesh_1, MuEnum_1, MuColliderSphere_1, MuColliderCapsule_1, MuColliderBox_1, MuColliderWheel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    MuColliderMesh_1 = __importDefault(MuColliderMesh_1);
    MuColliderSphere_1 = __importDefault(MuColliderSphere_1);
    MuColliderCapsule_1 = __importDefault(MuColliderCapsule_1);
    MuColliderBox_1 = __importDefault(MuColliderBox_1);
    MuColliderWheel_1 = __importDefault(MuColliderWheel_1);
    class MuCollider {
        static GetCollider(array, colliderType) {
            switch (colliderType) {
                case MuEnum_1.MuEnum.ET_MESH_COLLIDER:
                    return new MuColliderMesh_1.default(array, false);
                case MuEnum_1.MuEnum.ET_MESH_COLLIDER2:
                    return new MuColliderMesh_1.default(array, true);
                case MuEnum_1.MuEnum.ET_SPHERE_COLLIDER:
                    return new MuColliderSphere_1.default(array, false);
                case MuEnum_1.MuEnum.ET_SPHERE_COLLIDER2:
                    return new MuColliderSphere_1.default(array, true);
                case MuEnum_1.MuEnum.ET_CAPSULE_COLLIDER:
                    return new MuColliderCapsule_1.default(array, false);
                case MuEnum_1.MuEnum.ET_CAPSULE_COLLIDER2:
                    return new MuColliderCapsule_1.default(array, true);
                case MuEnum_1.MuEnum.ET_BOX_COLLIDER:
                    return new MuColliderBox_1.default(array, false);
                case MuEnum_1.MuEnum.ET_BOX_COLLIDER2:
                    return new MuColliderBox_1.default(array, true);
                case MuEnum_1.MuEnum.ET_WHEEL_COLLIDER:
                    return new MuColliderWheel_1.default(array);
                default:
                    throw `Unknown collider type ${colliderType} @${array.offset}`;
            }
        }
        Serialize(data) { }
        ;
    }
    exports.MuCollider = MuCollider;
});
//# sourceMappingURL=MuCollider.js.map