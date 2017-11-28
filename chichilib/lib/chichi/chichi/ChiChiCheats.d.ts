export declare class GameGenieCode {
    code: string;
    description: string;
    active: boolean;
}
export declare class MemoryPatch {
    address: number;
    data: number;
    compare: number;
    active: boolean;
}
export declare class ChiChiCheats {
    gameGenieCodeToPatch(code: string): MemoryPatch;
}
