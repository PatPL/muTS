import MuColliderMesh from "./MuColliderMesh";
import { MuEnum } from "../MuEnum";
import MuColliderSphere from "./MuColliderSphere";
import MuColliderCapsule from "./MuColliderCapsule";
import MuColliderBox from "./MuColliderBox";
import MuColliderWheel from "./MuColliderWheel";
import IMuBinary from "../IMuBinary";

export class MuCollider {
    
    public static GetCollider (array: IMuBinary, colliderType: number): MuCollider {
        if ((window as any).muTSlog) { console.log (`Redirecting to correct MuCollider @${array.offset}`) };
        
        switch (colliderType) {
            case MuEnum.ET_MESH_COLLIDER:
            return new MuColliderMesh (array, false);
            
            case MuEnum.ET_MESH_COLLIDER2:
            return new MuColliderMesh (array, true);
            
            case MuEnum.ET_SPHERE_COLLIDER:
            return new MuColliderSphere (array, false);
            
            case MuEnum.ET_SPHERE_COLLIDER2:
            return new MuColliderSphere (array, true);
            
            case MuEnum.ET_CAPSULE_COLLIDER:
            return new MuColliderCapsule (array, false);
            
            case MuEnum.ET_CAPSULE_COLLIDER2:
            return new MuColliderCapsule (array, true);
            
            case MuEnum.ET_BOX_COLLIDER:
            return new MuColliderBox (array, false);
            
            case MuEnum.ET_BOX_COLLIDER2:
            return new MuColliderBox (array, true);
            
            case MuEnum.ET_WHEEL_COLLIDER:
            return new MuColliderWheel (array);
            
            default:
            throw `Unknown collider type ${colliderType} @${array.offset}`;
        }
    }
    
    public Serialize (data: number[]) { };
    
}