class MuMesh {
    
    public Vertices: [number, number, number][] = [];
    public UVs: [number, number][] = [];
    public UV2s: [number, number][] = [];
    public Normals: [number, number, number][] = [];
    public Tangents: [number, number, number, number][] = [];
    public BoneWeights: MuBoneWeight[] = [];
    public BindPoses: BindPose[] = [];
    public Submeshes: [number, number, number][][] = [];
    public Colors: [number, number, number, number][] = [];
    
    constructor (array: IMuBinary) {
        if ((window as any).muTSlog) { console.log (`Reading MuMesh @${array.offset}`) };
        
        let start = MuBitConverter.ReadInt (array);
        if (start != MuEnum.ET_MESH_START) {
            console.error ("This shouldn't ever happen. Is the file corrupted?");
            throw `Expected a MeshStartValue here (${MuEnum.ET_MESH_START}), but got (${start}) instead @${array.offset}`;
        }
        
        let VerticleCount = MuBitConverter.ReadInt (array);
        let SubmeshCount = MuBitConverter.ReadInt (array);
        
        MeshLoop:
        while (true) {
            let Type = MuBitConverter.ReadInt (array);
            
            switch (Type) {
                case MuEnum.ET_MESH_END:
                if ((window as any).muTSlog) { console.log (`MuMesh END @${array.offset}`) };
                // Break while loop
                break MeshLoop;
                
                case MuEnum.ET_MESH_VERTS:
                if ((window as any).muTSlog) { console.log (`Reading MuMesh-Verticles (${VerticleCount} of them) @${array.offset}`) };
                for (let i = 0; i < VerticleCount; ++i) {
                    this.Vertices.push (MuBitConverter.ReadVector (array));
                }
                break;
                
                case MuEnum.ET_MESH_UV:
                if ((window as any).muTSlog) { console.log (`Reading MuMesh-UV (${VerticleCount} of them) @${array.offset}`) };
                for (let i = 0; i < VerticleCount; ++i) {
                    let x = MuBitConverter.ReadFloat (array);
                    let y = MuBitConverter.ReadFloat (array);
                    this.UVs.push ([x, y]);
                }
                break;
                
                case MuEnum.ET_MESH_UV2:
                if ((window as any).muTSlog) { console.log (`Reading MuMesh-UV2 (${VerticleCount} of them) @${array.offset}`) };
                for (let i = 0; i < VerticleCount; ++i) {
                    let x = MuBitConverter.ReadFloat (array);
                    let y = MuBitConverter.ReadFloat (array);
                    this.UV2s.push ([x, y]);
                }
                break;
                
                case MuEnum.ET_MESH_NORMALS:
                if ((window as any).muTSlog) { console.log (`Reading MuMesh-Normals (${VerticleCount} of them) @${array.offset}`) };
                for (let i = 0; i < VerticleCount; ++i) {
                    this.Normals.push (MuBitConverter.ReadVector (array));
                }
                break;
                
                case MuEnum.ET_MESH_TANGENTS:
                if ((window as any).muTSlog) { console.log (`Reading MuMesh-Tangents (${VerticleCount} of them) @${array.offset}`) };
                for (let i = 0; i < VerticleCount; ++i) {
                    this.Tangents.push (MuBitConverter.ReadTangent (array));
                }
                break;
                
                case MuEnum.ET_MESH_BONE_WEIGHTS:
                if ((window as any).muTSlog) { console.log (`Reading MuMesh-BoneWeights (${VerticleCount} of them) @${array.offset}`) };
                for (let i = 0; i < VerticleCount; ++i) {
                    this.BoneWeights.push (new MuBoneWeight (array));
                }
                break;
                
                case MuEnum.ET_MESH_BIND_POSES:
                if ((window as any).muTSlog) { console.log (`Reading MuMesh-BindPoses (I'll tell you how many of them in a second) @${array.offset}`) };
                
                let BindPoseCount = MuBitConverter.ReadInt (array);
                
                if ((window as any).muTSlog) { console.log (`There are ${BindPoseCount} bind poses to read`) };
                
                for (let i = 0; i < BindPoseCount; ++i) {
                    let pose: BindPose = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    
                    // 16 floats
                    for (let i = 0; i < 16; ++i) {
                        pose[i] = MuBitConverter.ReadFloat (array);
                    }
                    
                    this.BindPoses.push (pose);
                }
                break;
                
                case MuEnum.ET_MESH_TRIANGLES:
                if ((window as any).muTSlog) { console.log (`Reading MuMesh-Triangles (${VerticleCount} of them) @${array.offset}`) };
                let TriangleCount = MuBitConverter.ReadInt (array);
                let Triangles: [number, number, number][] = [];
                
                if (TriangleCount % 3 != 0) {
                    console.warn ("Is this guaranteed? Apparently not.");
                    console.warn ("Length of the array with triangles is not a multiple of 3. Will try to continue anyway. Mesh might be corrupted though.");
                }
                
                for (let i = 0; i < TriangleCount / 3; ++i) {
                    let x = MuBitConverter.ReadInt (array);
                    let y = MuBitConverter.ReadInt (array);
                    let z = MuBitConverter.ReadInt (array);
                    
                    // #reverse the triangle winding for Blender (because of the LHS/RHS swap)
                    // #avoid putting 0 at the end of the list (Blender doesn't like that)
                    if (x == 0) {
                        Triangles.push ([x, z, y]);
                    } else {
                        Triangles.push ([z, y, x]);
                    }
                }
                this.Submeshes.push (Triangles);
                break;
                
                case MuEnum.ET_MESH_VERTEX_COLORS:
                if ((window as any).muTSlog) { console.log (`Reading MuMesh-VertexColors (${VerticleCount} of them) @${array.offset}`) };
                for (let i = 0; i < VerticleCount; ++i) {
                    this.Colors.push (MuBitConverter.ReadColor (array));
                }
                break;
                
                default:
                throw `Unknown mesh value type: ${Type} @${array.offset}`;
            }
        }
    }
    
    public Serialize (data: number[]) {
        MuBitConverter.WriteInt (data, MuEnum.ET_MESH_START);
        MuBitConverter.WriteInt (data, this.Vertices.length);
        MuBitConverter.WriteInt (data, this.Submeshes.length);
        
        MuBitConverter.WriteInt (data, MuEnum.ET_MESH_VERTS);
        this.Vertices.forEach (v => {
            MuBitConverter.WriteVector (data, v);
        });
        
        if (this.Vertices.length == this.UVs.length) {
            MuBitConverter.WriteInt (data, MuEnum.ET_MESH_UV);
            this.UVs.forEach (uv => {
                MuBitConverter.WriteFloat (data, uv[0]);
                MuBitConverter.WriteFloat (data, uv[1]);
            });
        }
        
        if (this.Vertices.length == this.UV2s.length) {
            MuBitConverter.WriteInt (data, MuEnum.ET_MESH_UV2);
            this.UV2s.forEach (uv2 => {
                MuBitConverter.WriteFloat (data, uv2[0]);
                MuBitConverter.WriteFloat (data, uv2[1]);
            });
        }
        
        if (this.Vertices.length == this.Normals.length) {
            MuBitConverter.WriteInt (data, MuEnum.ET_MESH_NORMALS);
            this.Normals.forEach (normal => {
                MuBitConverter.WriteVector (data, normal);
            });
        }
        
        if (this.Vertices.length == this.Tangents.length) {
            MuBitConverter.WriteInt (data, MuEnum.ET_MESH_TANGENTS);
            this.Tangents.forEach (tangent => {
                MuBitConverter.WriteTangent (data, tangent);
            });
        }
        
        if (this.Vertices.length == this.BoneWeights.length) {
            MuBitConverter.WriteInt (data, MuEnum.ET_MESH_BONE_WEIGHTS);
            this.BoneWeights.forEach (boneWeight => {
                boneWeight.Serialize (data);
            });
        }
        
        if (this.BindPoses.length > 0) {
            MuBitConverter.WriteInt (data, MuEnum.ET_MESH_BIND_POSES);
            MuBitConverter.WriteInt (data, this.BindPoses.length);
            this.BindPoses.forEach (pose => {
                // 16 floats
                for (let i = 0; i < 16; ++i) {
                    MuBitConverter.WriteFloat (data, pose[i]);
                }
            });
        }
        
        if (this.Vertices.length == this.Colors.length) {
            MuBitConverter.WriteInt (data, MuEnum.ET_MESH_VERTEX_COLORS);
            this.Colors.forEach (color => {
                MuBitConverter.WriteColor (data, color);
            });
        }
        
        this.Submeshes.forEach (submesh => {
            MuBitConverter.WriteInt (data, MuEnum.ET_MESH_TRIANGLES);
            MuBitConverter.WriteInt (data, submesh.length * 3);
            
            submesh.forEach (triangle => {
                let [x, z, y] = triangle;
                
                MuBitConverter.WriteInt (data, x);
                MuBitConverter.WriteInt (data, y);
                MuBitConverter.WriteInt (data, z);
            });
        });
        
        MuBitConverter.WriteInt (data, MuEnum.ET_MESH_END);
        
    }
    
}

// (16 floats tuple) array
type BindPose = [
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
    number, number, number, number
];