export declare class TileDoodler {
    private ppu;
    static powersOfTwo: number[];
    currentNameTableEntries: Array<Array<Uint8Array>>;
    currentPatternTableEntries: Array<Array<Array<Uint8Array>>>;
    XOffset: number;
    YOffset: number;
    constructor(ppu: any);
    GetPatternTableEntry(PatternTable: number, TileIndex: number, attributeByte: number, actualAddress: any): Uint8Array;
    GetSprite(PatternTable: any, TileIndex: any, attributeByte: any, flipX: any, flipY: any): Uint8Array;
    DrawRect(newData: any, width: number, height: number, xPos: number, yPos: number): void;
    DrawAllTiles(): void;
    GetAttributeTableEntry(ppuNameTableMemoryStart: number, i: number, j: number): number;
    DoodleNameTable(NameTable: any): Int32Array;
    DrawTile(destBuffer: Int32Array, width: number, height: number, tile: Uint8Array, xPos: number, yPos: number): void;
    GetNameTableEntryLocation(x: number, y: number): number;
}
