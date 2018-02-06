export interface GameGenieCode {
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
export declare const ChiChiCheats: {
    gameGenieCodeToPatch: (code: string) => MemoryPatch;
};
