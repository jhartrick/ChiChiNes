import { BaseCart, IBaseCart } from '../chichicarts/BaseCart';
import { ChiChiSprite, PpuStatus } from './ChiChiTypes';
import { ChiChiCPPU } from "./ChiChiMachine";
import { ChiChiAPU } from "./ChiChiAudio";

export interface IChiChiPPU {
    LastcpuClock: number;
    NMIHandler: () => void;
    frameFinished: () => void;
    cpu: ChiChiCPPU;
    greyScale: boolean;
    chrRomHandler: IBaseCart;
    unpackedSprites: ChiChiSprite[];
    emphasisBits: number;
    backgroundPatternTableIndex: number;
    spriteRAM: Uint8Array;
    byteOutBuffer: Uint8Array;
    ChrRomHandler: IBaseCart;

    GetPPUStatus(): PpuStatus;

    readonly SpritePatternTableIndex: number;

    Initialize(): void;
    WriteState(writer: any): void;
    ReadState(state: any): void;
    readonly NMIIsThrown: boolean;
    setupVINT(): void;


    SetByte(Clock: number, address: number, data: number): void;
    GetByte(Clock: number, address: number): number;
    copySprites(copyFrom: number): void;
    advanceClock(ticks: number): void;
}

export class ChiChiPPU implements IChiChiPPU {
    public static pal: Uint32Array = new Uint32Array([7961465, 10626572, 11407400, 10554206, 7733552, 2753820, 725017, 271983, 278855, 284436, 744967, 3035906, 7161605, 0, 131586, 131586, 12566719, 14641430, 15614283, 14821245, 12196292, 6496468, 2176980, 875189, 293472, 465210, 1597716, 5906953, 11090185, 2961197, 197379, 197379, 16316149, 16298569, 16588080, 16415170, 15560682, 12219892, 7115511, 4563694, 2277591, 2151458, 4513360, 1957181, 14604331, 6579811, 263172, 263172, 16447992, 16441012, 16634316, 16500447, 16236786, 14926838, 12831991, 11393781, 2287340, 5500370, 11858360, 14283440, 15921318, 13158344, 328965, 328965, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    public LastcpuClock: number = 0;

    // events
    NMIHandler: () => void;
    public frameFinished: () => void;
    cpu: ChiChiCPPU;
    greyScale: boolean = false;
    
    constructor() {
        this.initSprites();
    }

    // Rom handler
    chrRomHandler: IBaseCart;
    
    // private members
    // scanline position
    private yPosition: number = 0;
    private xPosition: number = 0;
    // current draw location in outbuffer    
    private vbufLocation: number = 0;
    
    private currentAttributeByte: number = 0;

    // sprite info
    private spriteSize: number = 0;
    private spritesOnThisScanline: number = 0;
    private currentSprites: ChiChiSprite[];
    private _spriteCopyHasHappened: boolean = false;
    private spriteZeroHit: boolean = false;
    unpackedSprites: ChiChiSprite[];
    emphasisBits = 0;
    
    private isForegroundPixel: boolean = false;

    private spriteChanges: boolean = false;

    private ppuReadBuffer: number = 0;
    private _clipSprites: boolean = false;
    private _clipTiles: boolean = false;
    private _tilesAreVisible: boolean = false;
    private _spritesAreVisible: boolean = false;

    private nameTableMemoryStart: number = 0;

    backgroundPatternTableIndex: number = 0;


    //PPU implementation
    private _PPUAddress: number = 0;
    private _PPUStatus: number = 0;
    _PPUControlByte0: number = 0; _PPUControlByte1: number = 0;
    private _spriteAddress: number = 0;


    private currentXPosition = 0;
    private currentYPosition = 0;
    private _hScroll = 0;
    private _vScroll = 0;
    private lockedHScroll = 0;
    private lockedVScroll = 0;
    //private scanlineNum = 0;
    //private scanlinePos = 0;

    private shouldRender = false;

    //private NMIHasBeenThrownThisFrame = false;
    private _frames = 0;
    private hitSprite = false;
    private PPUAddressLatchIsHigh = true;
    private p32 = new Uint32Array(256);// System.Array.init(256, 0, System.Int32);
    private isRendering = true;
    public frameClock = 0;
    public FrameEnded = false;
    private frameOn = false;
    //private framePalette = System.Array.init(256, 0, System.Int32);
    private nameTableBits = 0;
    private vidRamIsRam = true;
    _palette = new Uint8Array(32);// System.Array.init(32, 0, System.Int32);
    private _openBus = 0;
    private sprite0scanline = 0;
    private sprite0x = 0;
    private _maxSpritesPerScanline = 64;

    private xNTXor = 0; private yNTXor = 0;

    private spriteRAMBuffer = new SharedArrayBuffer(256 * Uint8Array.BYTES_PER_ELEMENT);
    spriteRAM = new Uint8Array(<any>this.spriteRAMBuffer); // System.Array.init(256, 0, System.Int32);
    private spritesOnLine = new Array<number>(512); // System.Array.init(512, 0, System.Int32);
    private currentTileIndex = 0;
    private fetchTile = true;

    // tile bytes currently latched in ppu
    private patternEntry = 0; private patternEntryByte2 = 0;

    public byteOutBuffer = new Uint8Array(256 * 256 * 4);// System.Array.init(262144, 0, System.Int32);


    set ChrRomHandler(value: IBaseCart) {
        this.chrRomHandler = value;
    }
    get ChrRomHandler(): IBaseCart {
        return this.chrRomHandler;
    }

    PPU_IRQAsserted: boolean;

    get NextEventAt(): number {

        if (this.frameClock < 6820) {
            return (6820 - this.frameClock) / 3;
        } else {
            return (((89345 - this.frameClock) / 341) / 3);
        }
    }

    GetPPUStatus(): PpuStatus {
        return {
            status: this._PPUStatus,
            controlByte0: this._PPUControlByte0,
            controlByte1: this._PPUControlByte1,
            nameTableStart: this.nameTableMemoryStart,
            currentTile: this.currentTileIndex,
            lockedVScroll: this.lockedVScroll,
            lockedHScroll: this.lockedHScroll,
            X: this.currentXPosition,
            Y: this.currentYPosition

        }
    }
    public get PatternTableIndex(): number {
        return this.backgroundPatternTableIndex;
    }
    public get SpritePatternTableIndex(): number {
        let spritePatternTable = 0;
        if ((this._PPUControlByte0 & 32) === 32) {
            spritePatternTable = 4096;
        }
        return spritePatternTable;
    }


    Initialize(): void {
        this._PPUAddress = 0;
        this._PPUStatus = 0;
        this._PPUControlByte0 = 0;
        this._PPUControlByte1 = 0;
        this._hScroll = 0;
        this._vScroll = 0;
        //this.scanlineNum = 0;
        //this.scanlinePos = 0;
        this._spriteAddress = 0;
        
        this.initSprites();
    }

    WriteState(writer: any): void {
        throw new Error('Method not implemented.');
    }

    ReadState(state: any): void {
        throw new Error('Method not implemented.');
    }

    get NMIIsThrown(): boolean {
        return (this._PPUControlByte0 & 128) === 128;
    }

    setupVINT(): void {
        this._PPUStatus = this._PPUStatus | 128;
        this._frames = this._frames + 1;

        if (this._PPUControlByte0 & 128) {
            this.cpu._handleNMI = true;
        }
    }

    VidRAM_GetNTByte(address: number): number {
        let result = 0;
        if (address >= 8192 && address < 12288) {

            result = this.chrRomHandler.GetPPUByte(0, address);

        } else {
            result = this.chrRomHandler.GetPPUByte(0, address);
        }
        return result;
    }

    SetByte(Clock: number, address: number, data: number): void {
        switch (address & 7) {
            case 0:

                this._PPUControlByte0 = data;
                this._openBus = data;
                this.nameTableBits = this._PPUControlByte0 & 3;
                this.backgroundPatternTableIndex = ((this._PPUControlByte0 & 16) >> 4) * 0x1000;

                this.nameTableMemoryStart = this.nameTableBits * 0x400;
                break;
            case 1:
                this.isRendering = (data & 0x18) !== 0;
                this._PPUControlByte1 = data;
                this.greyScale = (this._PPUControlByte1 & 0x1) === 0x1;
                this.emphasisBits = (this._PPUControlByte1 >> 5) & 7;
                this._spritesAreVisible = (this._PPUControlByte1 & 0x10) === 0x10;
                this._tilesAreVisible = (this._PPUControlByte1 & 0x08) === 0x08;
                this._clipTiles = (this._PPUControlByte1 & 0x02) !== 0x02;
                this._clipSprites = (this._PPUControlByte1 & 0x04) !== 0x04;

                this.nameTableMemoryStart = this.nameTableBits * 0x400;
                break;
            case 2:
                this.ppuReadBuffer = data;
                this._openBus = data;
                break;
            case 3:
                this._spriteAddress = data & 0xFF;
                this._openBus = this._spriteAddress;
                break;
            case 4:
                this.spriteRAM[this._spriteAddress] = data;
                this._spriteAddress = (this._spriteAddress + 1) & 255;
                this.unpackedSprites[this._spriteAddress >> 2].Changed = true;
                this.spriteChanges = true;
                break;
            case 5:
                if (this.PPUAddressLatchIsHigh) {
                    this._hScroll = data;
                    this.lockedHScroll = this._hScroll & 7;
                    this.PPUAddressLatchIsHigh = false;
                } else {
                    this._vScroll = data;
                    if (data > 240) {
                        this._vScroll = data - 256;
                    }
                        
                    if (!this.frameOn || (this.frameOn && !this.isRendering)) {
                        this.lockedVScroll = this._vScroll;
                    }

                    this.PPUAddressLatchIsHigh = true;
                    this.UpdatePixelInfo();

                }
                break;
            case 6:

                if (this.PPUAddressLatchIsHigh) {

                    this._PPUAddress = (this._PPUAddress & 0xFF) | ((data & 0x3F) << 8);
                    this.PPUAddressLatchIsHigh = false;
                } else {

                    this._PPUAddress = (this._PPUAddress & 0x7F00) | data & 0xFF;
                    this.PPUAddressLatchIsHigh = true;

                    this._hScroll = ((this._PPUAddress & 0x1f) << 3);
                    this._vScroll = (((this._PPUAddress >> 5) & 0x1f) << 3);
                    this._vScroll |= ((this._PPUAddress >> 12) & 3);

                    if (this.frameOn) {

                        this.lockedHScroll = this._hScroll;
                        this.lockedVScroll = this._vScroll;
                        this.lockedVScroll = this.lockedVScroll - this.currentYPosition;
                    }

                    this.nameTableBits = ((this._PPUAddress >> 10) & 3);
                    this.nameTableMemoryStart = this.nameTableBits * 0x400;
                }
                break;
            case 7:

                if ((this._PPUAddress & 0xFF00) === 0x3F00) {

                    const palAddress = (this._PPUAddress) & 0x1F;
                    this._palette[palAddress] = data;

                    if ((this._PPUAddress & 0xFFEF) === 0x3F00) {
                        this._palette[(palAddress ^ 16) & 0x1F] = data;
                    }
                } else {
                    // if ((this._PPUAddress & 0xF000) === 0x2000) {
                    //     this.chrRomHandler.SetPPUByte(Clock, this._PPUAddress, data);
                    // }
                    
                    this.chrRomHandler.SetPPUByte(Clock, this._PPUAddress, data);
                }
                // if controlbyte0.4, set ppuaddress + 32, else inc
                if ((this._PPUControlByte0 & 4) === 4) {
                    this._PPUAddress = (this._PPUAddress + 32);
                } else {
                    this._PPUAddress = (this._PPUAddress + 1);
                }
                // reset the flag which makex xxx6 set the high byte of address
                this.PPUAddressLatchIsHigh = true;
                this._PPUAddress = (this._PPUAddress & 0x3FFF);
                break;
        }
    }

    GetByte(Clock: number, address: number): number {

        switch (address & 7) {
            case 3:
            case 0:
            case 1:
            case 5:
            case 6:
                return this._openBus;
            case 2:
                let ret = 0;
                this.PPUAddressLatchIsHigh = true;
                ret = (this.ppuReadBuffer & 0x1F) | this._PPUStatus;

                if ((ret & 0x80) === 0x80) {
                    this._PPUStatus = this._PPUStatus & ~0x80;
                }
                return ret;
            case 4:
                return this.spriteRAM[this._spriteAddress];
            case 7:
                let tmp = 0;
                if ((this._PPUAddress & 0xFF00) === 0x3F00) {
                    tmp = this._palette[this._PPUAddress & 0x1F];

                    this.ppuReadBuffer = this.chrRomHandler.GetPPUByte(Clock, this._PPUAddress - 4096);
                } else {
                    tmp = this.ppuReadBuffer;
                    if (this._PPUAddress >= 0x2000 && this._PPUAddress <= 0x2FFF) {
                        this.ppuReadBuffer = this.chrRomHandler.GetPPUByte(Clock, this._PPUAddress);
                    } else {
                        this.ppuReadBuffer = this.chrRomHandler.GetPPUByte(Clock, this._PPUAddress & 0x3FFF);
                    }
                }
                if ((this._PPUControlByte0 & 4) === 4) {
                    this._PPUAddress = this._PPUAddress + 32;
                } else {
                    this._PPUAddress = this._PPUAddress + 1;
                }
                this._PPUAddress = (this._PPUAddress & 0x3FFF);
                return tmp;
        }
        return 0;
    }


    copySprites(copyFrom: number): void {
        for (var i = 0; i < 256; ++i) {
            var spriteLocation = (this._spriteAddress + i) & 255;
            if (this.spriteRAM[spriteLocation] !== this.cpu.Rams[copyFrom + i]) {
                this.spriteRAM[spriteLocation] = this.cpu.Rams[copyFrom + i];
                this.unpackedSprites[(spriteLocation >> 2) & 255].Changed = true;
            }
        }
        this._spriteCopyHasHappened = true;
        this.spriteChanges = true;
    }

    initSprites(): void {
        this.currentSprites = new Array<ChiChiSprite>(this._maxSpritesPerScanline); 
        for (let i = 0; i < this._maxSpritesPerScanline; ++i) {
            this.currentSprites[i] = new ChiChiSprite();
        }

        this.unpackedSprites = new Array<ChiChiSprite>(64);

        for (let i = 0; i < 64; ++i) {
            this.unpackedSprites[i] = new ChiChiSprite();
        }

    }

    getSpritePixel(): number {
        this.isForegroundPixel = false;
        this.spriteZeroHit = false;
        let result = 0;
        let yLine = 0;
        let xPos = 0;
        let tileIndex = 0;

        for (let i = 0; i < this.spritesOnThisScanline; ++i) {
            let currSprite = this.currentSprites[i];
            if (currSprite.XPosition > 0 && this.currentXPosition >= currSprite.XPosition && this.currentXPosition < currSprite.XPosition + 8) {

                let spritePatternTable = 0;
                if ((this._PPUControlByte0 & 8) === 8) {
                    spritePatternTable = 4096;
                }
                xPos = this.currentXPosition - currSprite.XPosition;
                yLine = this.currentYPosition - currSprite.YPosition - 1;

                yLine = yLine & (this.spriteSize - 1);

                tileIndex = currSprite.TileIndex;

                if ((this._PPUControlByte0 & 32) === 32) {
                    if ((tileIndex & 1) === 1) {
                        spritePatternTable = 4096;
                        tileIndex = tileIndex ^ 1;
                    } else {
                        spritePatternTable = 0;
                    }
                }

                let patternEntry = 0;
                let patternEntryBit2 = 0;

                if (currSprite.FlipY) {
                    yLine = this.spriteSize - yLine - 1;
                }

                if (yLine >= 8) {
                    yLine += 8;
                }

                patternEntry = this.chrRomHandler.GetPPUByte(0, spritePatternTable + tileIndex * 16 + yLine);
                patternEntryBit2 = this.chrRomHandler.GetPPUByte(0, spritePatternTable + tileIndex * 16 + yLine + 8);

                result = (currSprite.FlipX ? ((patternEntry >> xPos) & 1) | (((patternEntryBit2 >> xPos) << 1) & 2) : ((patternEntry >> 7 - xPos) & 1) | (((patternEntryBit2 >> 7 - xPos) << 1) & 2)) & 255;

                if (result !== 0) {
                    if (currSprite.SpriteNumber === 0) {
                        this.spriteZeroHit = true;
                    }
                    this.isForegroundPixel = currSprite.Foreground;
                    return (result | currSprite.AttributeByte);
                }
            }
        }
        return 0;
    }

    decodeSpritePixel(patternTableIndex: number, x: number, y: number, sprite: { v: ChiChiSprite; }, tileIndex: number): number {
        // 8x8 tile
        let patternEntry = 0;
        let patternEntryBit2 = 0;

        if (sprite.v.FlipY) {
            y = this.spriteSize - y - 1;
        }

        if (y >= 8) {
            y += 8;
        }
        const dataAddress = patternTableIndex + (tileIndex << 4) + y;
        patternEntry = this.chrRomHandler.GetPPUByte(this.LastcpuClock, dataAddress);
        patternEntryBit2 = this.chrRomHandler.GetPPUByte(this.LastcpuClock, dataAddress + 8);

        return (sprite.v.FlipX ? ((patternEntry >> x) & 1) | (((patternEntryBit2 >> x) << 1) & 2) : ((patternEntry >> 7 - x) & 1) | (((patternEntryBit2 >> 7 - x) << 1) & 2));
    }
    
    preloadSprites(scanline: number): void {
        this.spritesOnThisScanline = 0;
        this.sprite0scanline = -1;

        let yLine = this.currentYPosition - 1;

        for (let spriteNum = 0; spriteNum < 256; spriteNum += 4) {
            const spriteID = ((spriteNum + this._spriteAddress) & 0xff) >> 2;

            const y = this.unpackedSprites[spriteID].YPosition + 1;

            if (scanline >= y && scanline < y + this.spriteSize) {
                if (spriteID === 0) {
                    this.sprite0scanline = scanline;
                    this.sprite0x = this.unpackedSprites[spriteID].XPosition;
                }

                // var spId = spriteNum >> 2;
                // if (spId < 32) {
                //     this.outBuffer[(64768) + yLine] |= 1 << spId;
                // } else {
                //     this.outBuffer[(65024) + yLine] |= 1 << (spId - 32);
                // }

                this.currentSprites[this.spritesOnThisScanline] = this.unpackedSprites[spriteID];
                this.currentSprites[this.spritesOnThisScanline].IsVisible = true;

                this.spritesOnThisScanline++;
                if (this.spritesOnThisScanline === this._maxSpritesPerScanline) {
                    break;
                }
            }
        }
        if (this.spritesOnThisScanline > 7) {
            this._PPUStatus = this._PPUStatus | 32;
        }

    }

    unpackSprites(): void {
        for (var currSprite = 0; currSprite < this.unpackedSprites.length; ++currSprite) {
            if (this.unpackedSprites[currSprite].Changed) {
                this.unpackSprite(currSprite);
            }
        }
    }

    unpackSprite(currSprite: number): void {
        const attrByte = this.spriteRAM[(currSprite << 2) + 2 | 0];
        this.unpackedSprites[currSprite].IsVisible = true;
        this.unpackedSprites[currSprite].AttributeByte = ((attrByte & 3) << 2) | 16;
        this.unpackedSprites[currSprite].YPosition = this.spriteRAM[currSprite * 4];
        this.unpackedSprites[currSprite].XPosition = this.spriteRAM[currSprite * 4 + 3];
        this.unpackedSprites[currSprite].SpriteNumber = currSprite;
        this.unpackedSprites[currSprite].Foreground = (attrByte & 32) !== 32;
        this.unpackedSprites[currSprite].FlipX = (attrByte & 64) === 64;
        this.unpackedSprites[currSprite].FlipY = (attrByte & 128) === 128;
        this.unpackedSprites[currSprite].TileIndex = this.spriteRAM[currSprite * 4 + 1];
        this.unpackedSprites[currSprite].Changed = false;
    }

    getNameTablePixel(): number {
        var result = ((this.patternEntry & 128) >> 7) | ((this.patternEntryByte2 & 128) >> 6);
        this.patternEntry <<= 1;
        this.patternEntryByte2 <<= 1;
        if (result > 0) {
            result |= this.currentAttributeByte;
        }
        return result & 255;
    }

    getAttrEntry(ppuNameTableMemoryStart: number, i: number, j: number): number {
        const LookUp = this.chrRomHandler.GetPPUByte(0, 8192 + ppuNameTableMemoryStart + 960 + (i >> 2) + ((j >> 2) * 8));

        switch ((i & 2) | (j & 2) * 2) {
            case 0:
                return (LookUp << 2) & 12;
            case 2:
                return LookUp & 12;
            case 4:
                return (LookUp >> 2) & 12;
            case 6:
                return (LookUp >> 4) & 12;
        }
        return 0;
    }
    oddFrame: boolean = true;

    advanceClock(ticks: number) {
        let ppuTicks = ticks * 3;

        if (this.frameClock > 89002 ) {
            this.frameClock += ppuTicks;
            if (this.frameClock > 89342) {
                ppuTicks = this.frameClock - 89342;
            } else {
                return;
            }
        }
        while (ppuTicks--) {
            switch (this.frameClock) {
                case 0: // start of rendering
                    this.shouldRender = true;
                    this.vbufLocation = 0;
                    this.currentXPosition = 0;
                    this.currentYPosition = 0;

                    this.xNTXor = 0;
                    this.yNTXor = 0;

                    if ((this._PPUControlByte1 & 0x18) !== 0) {
                        this.oddFrame = !this.oddFrame;
                        this.isRendering = true;
                        if (this.oddFrame) this.frameClock++;
                    }
                    break;
                case 81840: // ChiChiNES.CPU2A03.frameClockEnd:
                    this.shouldRender = false;

                    this.frameFinished();
                    this.frameOn = false;
                    
                    break;
                case 82523: // first tick on scanline after post-render line
                    this.setupVINT();
                    break;
                case 89002: 
                    this._PPUStatus = 0;
                    this.hitSprite = false;
                    this.spriteSize = ((this._PPUControlByte0 & 0x20) === 0x20) ? 16 : 8;
                    if (this.spriteChanges) {
                        this.unpackSprites();
                        this.spriteChanges = false;
                    }
                    this.frameOn = true;
                    
    
                    break;
            }

            if (this.shouldRender) {

                if (this.currentXPosition < 256 && this.vbufLocation < 61440) {
                    /* update x position */
                    this.xPosition = (this.currentXPosition + this.lockedHScroll);


                    if ((this.xPosition & 7) === 0) {
                        this.xNTXor = (this.xPosition & 0x100) ? 0x400 : 0;
                        this.xPosition &= 0xFF;

                        /* fetch next tile */
                        let ppuNameTableMemoryStart = this.nameTableMemoryStart ^ this.xNTXor ^ this.yNTXor;
                        let xTilePosition = this.xPosition >> 3;

                        const tileRow = (this.yPosition >> 3) % 30 << 5;

                        const tileNametablePosition = 0x2000 + ppuNameTableMemoryStart + xTilePosition + tileRow;

                        let tileIndex = this.chrRomHandler.GetPPUByte(this.LastcpuClock + ticks, tileNametablePosition);

                        let patternTableYOffset = this.yPosition & 7;

                        let patternID = this.backgroundPatternTableIndex + (tileIndex * 16) + patternTableYOffset;

                        this.patternEntry = this.chrRomHandler.GetPPUByte(this.LastcpuClock + ticks, patternID);
                        this.patternEntryByte2 = this.chrRomHandler.GetPPUByte(this.LastcpuClock + ticks, patternID + 8);

                        this.currentAttributeByte = this.getAttrEntry(ppuNameTableMemoryStart, xTilePosition, this.yPosition >> 3);
                        /* end fetch next tile */

                    }

                    let tilesVis = this._tilesAreVisible;
                    let spriteVis = this._spritesAreVisible;

                    if (this.currentXPosition < 8 ) {
                        tilesVis = tilesVis && !this._clipTiles;
                        spriteVis = tilesVis && !this._clipSprites;
                    } 
                    this.spriteZeroHit = false;
                    const tilePixel = tilesVis ? this.getNameTablePixel() : 0;
                    const spritePixel = spriteVis ? this.getSpritePixel() : 0;

                    if (!this.hitSprite && this.spriteZeroHit && tilePixel !== 0) {
                        this.hitSprite = true;
                        this._PPUStatus = this._PPUStatus | 64;
                    }


                    this.byteOutBuffer[this.vbufLocation * 4] = this._palette[(this.isForegroundPixel || (tilePixel === 0 && spritePixel !== 0)) ? spritePixel : tilePixel];
                    this.byteOutBuffer[(this.vbufLocation * 4) + 1] = this.emphasisBits;
                    this.vbufLocation++;
                }
                if (this.currentXPosition === 324) {
                    this.chrRomHandler.updateScanlineCounter();
                }
                this.currentXPosition++;

                if (this.currentXPosition > 340) {

                    this.currentXPosition = 0;
                    this.currentYPosition++;

                    this.preloadSprites(this.currentYPosition);
                    if (this.spritesOnThisScanline >= 7) {
                        this._PPUStatus = this._PPUStatus | 32;
                    }

                    this.lockedHScroll = this._hScroll;

                    this.UpdatePixelInfo();
                    //RunNewScanlineEvents 
                    this.yPosition = this.currentYPosition + this.lockedVScroll;

                    if (this.yPosition < 0) {
                        this.yPosition += 240;
                    }
                    if (this.yPosition >= 240) {
                        this.yPosition -= 240;
                        this.yNTXor = 2048;
                    } else {
                        this.yNTXor = 0;
                    }


                }
            }

            this.frameClock++;
            
            if (this.frameClock >= 89342) {
                this.frameClock = 0;
            }
        }
    }

    UpdatePixelInfo(): void {
        this.nameTableMemoryStart = this.nameTableBits * 0x400;
    }

} 