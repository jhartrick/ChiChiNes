export declare class GameGenieCode {
    code: string;
    description: string;
    active: boolean;
}
export declare class GeniePatch {
    address: number;
    data: number;
    compare: number;
    active: boolean;
}
export declare class ChiChiCheats {
    getCheatsForGame(crc: string): Array<GameGenieCode>;
    gameGenieCodeToPatch(code: string): GeniePatch;
}
