/**
 * Holds the Mu file binary data, keeps track of current offset, and provides file version to mu elements that need it
 */
interface IMuBinary {
    
    data: Uint8Array,
    offset: number,
    version: number
    
}