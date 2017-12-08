import { ChiChiSprite, PpuStatus } from './ChiChiTypes';
import { ChiChiCPPU } from './ChiChiCPU';
import { IMemoryMap } from './MemoryMaps/ChiChiMemoryMap';
import { StateBuffer } from './StateBuffer';
export interface IChiChiPPUState {
    spriteRAM: Uint8Array;
    controlByte0: number;
    controlByte1: number;
    address: number;
    status: number;
    spriteAddress: number;
    currentXPosition: number;
    currentYPosition: number;
    hScroll: number;
    vScroll: number;
    lockedHScroll: number;
    lockedVScroll: number;
}
export interface IChiChiPPU extends IChiChiPPUState {
    byteOutBuffer: Uint8Array;
    LastcpuClock: number;
    cpu: ChiChiCPPU;
    unpackedSprites: ChiChiSprite[];
    NMIHandler: () => void;
    frameFinished: () => void;
    GetPPUStatus(): PpuStatus;
    backgroundPatternTableIndex: number;
    readonly SpritePatternTableIndex: number;
    Initialize(): void;
    setupVINT(): void;
    memoryMap: IMemoryMap;
    SetByte(Clock: number, address: number, data: number): void;
    GetByte(Clock: number, address: number): number;
    copySprites(copyFrom: number): void;
    advanceClock(ticks: number): void;
    setupStateBuffer(sb: StateBuffer): void;
}
export declare class ChiChiPPU implements IChiChiPPU {
    static pal: Uint32Array;
    LastcpuClock: number;
    NMIHandler: () => void;
    frameFinished: () => void;
    cpu: ChiChiCPPU;
    greyScale: boolean;
    constructor();
    memoryMap: IMemoryMap;
    private yPosition;
    private xPosition;
    private vbufLocation;
    private currentAttributeByte;
    private spriteSize;
    private spritesOnThisScanline;
    private currentSprites;
    private _spriteCopyHasHappened;
    private spriteZeroHit;
    unpackedSprites: ChiChiSprite[];
    emphasisBits: number;
    private isForegroundPixel;
    private spriteChanges;
    private ppuReadBuffer;
    private clipSprites;
    private clipTiles;
    private tilesVisible;
    private spritesVisible;
    private nameTableMemoryStart;
    backgroundPatternTableIndex: number;
    address: number;
    status: number;
    controlByte0: number;
    controlByte1: number;
    spriteAddress: number;
    currentXPosition: number;
    currentYPosition: number;
    hScroll: number;
    vScroll: number;
    lockedHScroll: number;
    lockedVScroll: number;
    private shouldRender;
    framesRun: number;
    private hitSprite;
    private addressLatchIsHigh;
    private isRendering;
    frameClock: number;
    private oddFrame;
    private frameOn;
    private nameTableBits;
    palette: Uint8Array;
    private openBus;
    private sprite0scanline;
    private sprite0x;
    private _maxSpritesPerScanline;
    private xNTXor;
    private yNTXor;
    private spriteRAMBuffer;
    spriteRAM: Uint8Array;
    private spritesOnLine;
    private currentTileIndex;
    private fetchTile;
    private patternEntry;
    private patternEntryByte2;
    byteOutBuffer: Uint8Array;
    GetPPUStatus(): PpuStatus;
    readonly PatternTableIndex: number;
    readonly SpritePatternTableIndex: number;
    Initialize(): void;
    setupVINT(): void;
    SetByte(Clock: number, address: number, data: number): void;
    GetByte(Clock: number, address: number): number;
    copySprites(copyFrom: number): void;
    initSprites(): void;
    getSpritePixel(): number;
    decodeSpritePixel(patternTableIndex: number, x: number, y: number, sprite: {
        v: ChiChiSprite;
    }, tileIndex: number): number;
    preloadSprites(scanline: number): void;
    unpackSprites(): void;
    unpackSprite(currSprite: number): void;
    getNameTablePixel(): number;
    getAttrEntry(ppuNameTableMemoryStart: number, i: number, j: number): number;
    advanceClock(ticks: number): void;
    UpdatePixelInfo(): void;
    setupStateBuffer(sb: StateBuffer): StateBuffer;
    attachStateBuffer(sb: StateBuffer): void;
    updateStateBuffer(sb: StateBuffer): void;
}
