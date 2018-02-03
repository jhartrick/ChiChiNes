export declare class GameGenieCode {
    code: string;
    description: string;
    active: boolean;
}
export interface MemoryPatch {
    address: number;
    data: number;
    compare: number;
    active: boolean;
}
export declare function gameGenieCodeToPatch(code: string): MemoryPatch;
