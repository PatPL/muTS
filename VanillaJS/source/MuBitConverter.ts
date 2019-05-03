class MuBitConverter {
    
    /**
     * Read the next unsigned byte on the array
     * @param array The data+offset object. The function mutates the offset; it increments itself.
     */
    public static ReadByte (array: IMuBinary): number {
        if (array.data.length < array.offset + 1) {
            throw `EOF @${array.offset}`;
        }
        
        return array.data[array.offset++];
    }
    
    /**
     * Read the next signed integer on the array (Little endian)
     * @param array The data+offset object. The function mutates the offset; it increments itself.
     */
    public static ReadInt (array: IMuBinary): number {
        if (array.data.length < array.offset + 4) {
            throw `EOF @${array.offset}`;
        }
        
        let output = 0;
        output += array.data[array.offset++];
        output += array.data[array.offset++] << 8;
        output += array.data[array.offset++] << 16;
        output += array.data[array.offset++] << 24;
        return output;
    }
    
    /**
     * Read the next 7int(?) on the array
     * @param array The data+offset object. The function mutates the offset; it increments itself.
     */
    public static Read7Int (array: IMuBinary): number {
        /* What even is 7int? (My guess)
         * 00000000
         * ^|-----|<- Value (Next bytes get 128 compounding multiplier (Little endian))
         * |- This bit shows whether next byte is part of this value too
         * 
         * 00000010 <- 2
         * 01111111 <- 127
         * 10000000 00000001 <- 128
         * 10000001 00000001 <- 129
         * 
         * TBH that's a neat idea to save integers of arbitrary size; up to infinity.
         * (This implementation is probably locked to usual int32 size, check Write7Int)
         * I wonder how something like this could be implemented for floating point values
         */
        
        let output = 0;
        let multiplier = 1;
        
        while (true) {
            let currentByte = this.ReadByte (array);
            
            // Ignore the first bit, apply current multiplier
            output += (currentByte & 127) * multiplier;
            
            // Check only the first bit
            // Exit the loop if it's '0', continue if it's '1'
            if (currentByte < 128) {
                break;
            }
            
            // It didn't leave the loop, so we increase the multiplier and read next byte
            multiplier *= 128;
        }
        
        return output;
    }
    
    /**
     * Read the next unsigned integer on the array (Little endian)
     * @param array The data+offset object. The function mutates the offset; it increments itself.
     */
    public static ReadUInt (array: IMuBinary): number {
        if (array.data.length < array.offset + 4) {
            throw `EOF @${array.offset}`;
        }
        
        let output = 0;
        output += (array.data[array.offset++]) >>> 0;
        output += (array.data[array.offset++] << 8) >>> 0;
        output += (array.data[array.offset++] << 16) >>> 0;
        output += (array.data[array.offset++] << 24) >>> 0;
        // The '>>> 0' somehow makes the bitshifts unsigned. Go figure.
        // 
        // > 128 << 24
        // > -2147483648
        // 
        // > (128 << 24) >>> 0
        // > 2147483648
        return output;
    }
    
    /**
     * Read the next float on the array (Little endian)
     * @param array The data+offset object. The function mutates the offset; it increments itself.
     */
    public static ReadFloat (array: IMuBinary): number {
        // Allocate 4 bytes of raw memory
        let buffer = new ArrayBuffer (4);
        
        // Write next 4 bytes from the array to the buffer (offset gets incremented)
        new Int32Array (buffer)[0] = this.ReadInt (array);
        
        //Interpret these bytes as a float, and return the value
        return new Float32Array (buffer)[0];
    }
    
    /**
     * Read the next Vector3 on the array (3 floats)
     * @param array The data+offset object. The function mutates the offset; it increments itself.
     */
    public static ReadVector (array: IMuBinary): [number, number, number] {
        let x = this.ReadFloat (array); //Unity X
        let y = this.ReadFloat (array); //Unity Y
        let z = this.ReadFloat (array); //Unity Z
        // Blender's 'up' is 'Z', while Unity's 'up' is 'Y'
        // mu saves unity's X,Y,Z, so we need to rearrange them to have the same values as in blender
        return [x, z, y];
    }
    
    /**
     * Read the next Quaternion on the array (4 floats)
     * @param array The data+offset object. The function mutates the offset; it increments itself.
     */
    public static ReadQuaternion (array: IMuBinary): [number, number, number, number] {
        let x = this.ReadFloat (array); //Unity X
        let y = this.ReadFloat (array); //Unity Y
        let z = this.ReadFloat (array); //Unity Z
        let w = this.ReadFloat (array); //Unity W
        // Original author seems to know about quaternions more than me, so i'll copy his comments
        //
        // # Unity is xyzw, blender is wxyz. However, Unity is left-handed and
        // # blender is right handed. To convert between LH and RH (either
        // # direction), just swap y and z and reverse the rotation direction.
        return [w, -x, -z, -y];
    }
    
    /**
     * Read the next Tangent on the array (4 floats)
     * @param array The data+offset object. The function mutates the offset; it increments itself.
     */
    public static ReadTangent (array: IMuBinary): [number, number, number, number] {
        let x = this.ReadFloat (array); //Unity X
        let y = this.ReadFloat (array); //Unity Y
        let z = this.ReadFloat (array); //Unity Z
        let w = this.ReadFloat (array); //Unity W
        // No comments in the original code. I'll assume this is for mesh tangents.
        // No idea why w is negated here. Y<->Z change flips normals?
        return [x, z, y, -w]
    }
    
    /**
     * Read the next Color from the array
     * @param array The data+offset object. The function mutates the offset; it increments itself.
     */
    public static ReadColor (array: IMuBinary): [number, number, number, number] {
        // RGBA order is not explicitly documented anywhere, but I guess that's the order.
        let r = array.data[array.offset++] / 255;
        let g = array.data[array.offset++] / 255;
        let b = array.data[array.offset++] / 255;
        let a = array.data[array.offset++] / 255;
        
        return [r, g, b, a];
    }
    
    /**
     * Read the next [length] bytes from the array
     * @param array The data+offset object. The function mutates the offset; it increments itself.
     * @param length The amount of bytes to read
     */
    public static ReadBytes (array: IMuBinary, length: number): Uint8Array {
        if (array.data.length < array.offset + length) {
            throw `EOF @${array.offset}`;
        }
        
        // Increment the offset first to avoid using temporary variable
        array.offset += length;
        return array.data.slice (array.offset - length, array.offset);
    }
    
    /**
     * Read the next string from the array
     * @param array The data+offset object. The function mutates the offset; it increments itself.
     */
    public static ReadString (array: IMuBinary): string {
        let length = this.Read7Int (array);
        let stringData = this.ReadBytes (array, length);
        let output = "";
        
        stringData.forEach (c => {
            // Not sure if String.fromCharCode is an accurate representation of python's chr().
            // Works with regular text though, so I hope it's good enough.
            output += String.fromCharCode (c);
        });
        
        return output;
    }
    
    /**
     * Write a byte to the data array
     * @param data Output array
     * @param value The byte to write
     */
    public static WriteByte (data: number[], value: number) {
        // Make sure the value is an integer that doesn't exceed 255
        data.push (Math.round (value) & 255);
    }
    
    /**
     * Write a signed integer to the data array (Little endian)
     * @param data Output array
     * @param value The integer to write
     */
    public static WriteInt (data: number[], value: number) {
        // Make sure the value is an integer
        value = Math.round (value);
        
        // This should work for both signed and unsigned integers
        data.push (value & 255);
        data.push ((value >> 8) & 255);
        data.push ((value >> 16) & 255);
        data.push ((value >> 24) & 255);
    }
    
    /**
     * Write an integer as a 7int to the data array (Little endian)
     * @param data Output array
     * @param value The integer to write
     */
    public static Write7Int (data: number[], value: number) {
        // Check Read7Int for 7int format description
        
        // Make sure the value is an integer
        value = Math.round (value);
        
        // Looks like 7int is unsigned
        if (value < 0) {
            value += 2 ** 32;
        }
        
        // Looks like the value is clamped to 32 bytes of the integer
        // Mask out all bits other than first 32 bits (-1 is 32 '1's in binary)
        value &= -1;
        
        while (value > 127) {
            // Value larger than 127. Write 7 rightmost bytes of the integer, and set first bit to 1 to indicate the existence of the next block
            data.push (value & 127 + 128);
            
            // Move 7 bits to the right to get next batch of bits to write.
            value >>= 7;
            
            // The loop will now break if value is lower than 128, and last block will be written
        }
        
        // Remaining value lower than 128, so write out last block
        // No need to mask the value, because it's already lower than 128, and won't accidentaly set the first bit of the byte to '1'.
        data.push (value);
    }
    
    /**
     * Write an unsigned integer to the data array (Little endian)
     * @param data Output array
     * @param value The integer to write
     */
    public static WriteUInt (data: number[], value: number) {
        // WriteInt works for both signed and unsigned values.
        // 
        // 11111111 11111111 11111111 11111111
        // Differencing 4294967295 and -1 depends on how you read the bytes.
        this.WriteInt (data, value);
    }
    
    /**
     * Write a float to the data array (Little endian)
     * @param data Output array
     * @param value The float to write
     */
    public static WriteFloat (data: number[], value: number) {
        // Allocate 4 bytes of raw memory
        let buffer = new ArrayBuffer (4);
        
        // Write the float into the 4 bytes of the memory
        new Float32Array (buffer)[0] = value;
        
        //Interpret these bytes as an int to read the 4 bytes
        let rawValue = new Uint32Array (buffer)[0];
        
        data.push (rawValue & 255);
        data.push ((rawValue >>> 8) & 255);
        data.push ((rawValue >>> 16) & 255);
        data.push ((rawValue >>> 24) & 255);
    }
    
    /**
     * Write a Vector3 to the data array (3 floats)
     * @param data Output array
     * @param value The Vector3 to write
     */
    public static WriteVector (data: number[], value: [number, number, number]) {
        let [x, z, y] = value; // Unity X, Z, Y. Value tuple is Blender representation (Z up)
        
        this.WriteFloat (data, x);
        this.WriteFloat (data, y);
        this.WriteFloat (data, z);
    }
    
    /**
     * Write a Quaternion to the data array (4 floats)
     * @param data Output array
     * @param value The Quaternion to write
     */
    public static WriteQuaternion (data: number[], value: [number, number, number, number]) {
        // # Unity is xyzw, blender is wxyz. However, Unity is left-handed and
        // # blender is right handed. To convert between LH and RH (either
        // # direction), just swap y and z and reverse the rotation direction.
        
        // let [y, w, z, x] = value; // Unity XYZW
        // IMO this doesn't look right, but that's how it is in the original code, and I'm not confident enough to change it.
        this.WriteFloat (data, -value[1]);
        this.WriteFloat (data, -value[3]);
        this.WriteFloat (data, -value[2]);
        this.WriteFloat (data, value[0]);
    }
    
    /**
     * Write a Tangent to the data array (4 floats)
     * @param data Output array
     * @param value The Tangent to write
     */
    public static WriteTangent (data: number[], value: [number, number, number, number]) {
        let [x, z, y, w] = value; // Unity XYZW
        
        this.WriteFloat (data, x);
        this.WriteFloat (data, y);
        this.WriteFloat (data, z);
        this.WriteFloat (data, -w);
    }
    
    /**
     * Write a Color to the data array (4 floats)
     * @param data Output array
     * @param value The Color to write
     */
    public static WriteColor (data: number[], value: [number, number, number, number]) {
        // Value is (0.0 - 1.0)
        // RGBA order is not explicitly documented anywhere, but I guess that's the order.
        let [r, g, b, a] = value;
        
        // Clamp the value to 0 - 1, multiply by 255 and round.
        // The pipeline operator can't come soon enough :/
        this.WriteByte (data, Math.round (Math.max (Math.min (r, 1), 0) * 255));
        this.WriteByte (data, Math.round (Math.max (Math.min (g, 1), 0) * 255));
        this.WriteByte (data, Math.round (Math.max (Math.min (b, 1), 0) * 255));
        this.WriteByte (data, Math.round (Math.max (Math.min (a, 1), 0) * 255));
    }
    
    /**
     * Write an array of bytes to the data array (4 floats)
     * @param data Output array
     * @param value The bytes to write
     */
    public static WriteBytes (data: number[], value: Uint8Array) {
        value.forEach (b => {
            data.push (b);
        });
    }
    
    /**
     * Write a string to the data array (4 floats)
     * @param data Output array
     * @param value The string to write
     */
    public static WriteString (data: number[], value: string) {
        this.Write7Int (data, value.length);
        
        for (let i = 0; i < value.length; ++i) {
            data.push (value.charCodeAt (i));
        }
    }
}