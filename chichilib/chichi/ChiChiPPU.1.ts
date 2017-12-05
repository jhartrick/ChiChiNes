import { BaseCart, IBaseCart } from '../chichicarts/BaseCart';
import { ChiChiSprite, PpuStatus } from './ChiChiTypes';
import { ChiChiCPPU } from './ChiChiCPU';
import { ChiChiAPU, IChiChiAPUState } from './ChiChiAudio';
import { IMemoryMap } from './ChiChiMemoryMap';
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

export class ChiChiPPU2 implements IChiChiPPU {
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
    
    memoryMap: IMemoryMap;

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
    address: number = 0;
    status: number = 0;
    controlByte0: number = 0; 
    controlByte1: number = 0;
    spriteAddress: number = 0;
    currentXPosition = 0;
    currentYPosition = 0;
    hScroll = 0;
    vScroll = 0;
    lockedHScroll = 0;
    lockedVScroll = 0;
    private shouldRender = false;

    framesRun = 0;
    
    private hitSprite = false;
    private addressLatchIsHigh = true;

    private isRendering = true;

    public frameClock = 0;
    private oddFrame: boolean = true;
    private frameOn = false;

    private nameTableBits = 0;

    palette = new Uint8Array(32); 
    private openBus = 0;
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

    public byteOutBuffer = new Uint8Array(256 * 256 * 4); // System.Array.init(262144, 0, System.Int32);

    GetPPUStatus(): PpuStatus {
        return {
            status: this.status,
            controlByte0: this.controlByte0,
            controlByte1: this.controlByte1,
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
        if ((this.controlByte0 & 32) === 32) {
            spritePatternTable = 4096;
        }
        return spritePatternTable;
    }


    Initialize(): void {
        this.address = 0;
        this.status = 0;
        this.controlByte0 = 0;
        this.controlByte1 = 0;
        this.hScroll = 0;
        this.vScroll = 0;
        //this.scanlineNum = 0;
        //this.scanlinePos = 0;
        this.spriteAddress = 0;
        
        this.initSprites();
    }


    setupVINT(): void {
        this.status = this.status | 128;
        this.framesRun = this.framesRun + 1;

        if (this.controlByte0 & 128) {
            this.cpu._handleNMI = true;
        }
    }

    SetByte(Clock: number, address: number, data: number): void {
        switch (address & 7) {
            case 0:

                this.controlByte0 = data;
                this.openBus = data;
                this.nameTableBits = this.controlByte0 & 3;
                this.backgroundPatternTableIndex = ((this.controlByte0 & 16) >> 4) * 0x1000;

                this.nameTableMemoryStart = this.nameTableBits * 0x400;
                break;
            case 1:
                this.isRendering = (data & 0x18) !== 0;
                this.controlByte1 = data;
                this.emphasisBits = (this.controlByte1 >> 5) & 7;

                this.greyScale = (this.controlByte1 & 0x1) === 0x1;
                this._clipTiles = (this.controlByte1 & 0x02) !== 0x02;
                this._clipSprites = (this.controlByte1 & 0x04) !== 0x04;
                this._tilesAreVisible = (this.controlByte1 & 0x08) === 0x08;
                this._spritesAreVisible = (this.controlByte1 & 0x10) === 0x10;
                break;
            case 2:
                this.ppuReadBuffer = data;
                this.openBus = data;
                break;
            case 3:
                this.spriteAddress = data & 0xFF;
                this.openBus = this.spriteAddress;
                break;
            case 4:
                this.spriteRAM[this.spriteAddress] = data;
                this.spriteAddress = (this.spriteAddress + 1) & 255;
                this.unpackedSprites[this.spriteAddress >> 2].Changed = true;
                this.spriteChanges = true;
                break;
            case 5:
                if (this.addressLatchIsHigh) {
                    this.hScroll = data;
                    this.lockedHScroll = this.hScroll & 7;
                    this.addressLatchIsHigh = false;
                } else {
                    this.vScroll = data;
                    if (data > 240) {
                        this.vScroll = data - 256;
                    }
                        
                    if (!this.frameOn || (this.frameOn && !this.isRendering)) {
                        this.lockedVScroll = this.vScroll;
                    }

                    this.addressLatchIsHigh = true;
                    this.UpdatePixelInfo();

                }
                break;
            case 6:

                if (this.addressLatchIsHigh) {

                    this.address = (this.address & 0xFF) | ((data & 0x3F) << 8);
                    this.addressLatchIsHigh = false;
                } else {

                    this.address = (this.address & 0x7F00) | data & 0xFF;
                    this.addressLatchIsHigh = true;

                    this.hScroll = ((this.address & 0x1f) << 3);
                    this.vScroll = (((this.address >> 5) & 0x1f) << 3);
                    this.vScroll |= ((this.address >> 12) & 3);

                    if (this.frameOn) {

                        this.lockedHScroll = this.hScroll;
                        this.lockedVScroll = this.vScroll;
                        this.lockedVScroll = this.lockedVScroll - this.currentYPosition;
                    }

                    this.nameTableBits = ((this.address >> 10) & 3);
                    this.nameTableMemoryStart = this.nameTableBits * 0x400;
                }
                break;
            case 7:

                if ((this.address & 0xFF00) === 0x3F00) {

                    const palAddress = (this.address) & 0x1F;
                    this.palette[palAddress] = data;

                    if ((this.address & 0xFFEF) === 0x3F00) {
                        this.palette[(palAddress ^ 16) & 0x1F] = data;
                    }
                } else {
                    // if ((this._PPUAddress & 0xF000) === 0x2000) {
                    //     this.memoryMap.setPPUByte(Clock, this._PPUAddress, data);
                    // }
                    
                    this.memoryMap.setPPUByte(Clock, this.address, data);
                }
                // if controlbyte0.4, set ppuaddress + 32, else inc
                if ((this.controlByte0 & 4) === 4) {
                    this.address = (this.address + 32);
                } else {
                    this.address = (this.address + 1);
                }
                // reset the flag which makex xxx6 set the high byte of address
                this.addressLatchIsHigh = true;
                this.address = (this.address & 0x3FFF);
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
                return this.openBus;
            case 2:
                let ret = 0;
                this.addressLatchIsHigh = true;
                ret = (this.ppuReadBuffer & 0x1F) | this.status;

                if ((ret & 0x80) === 0x80) {
                    this.status = this.status & ~0x80;
                }
                return ret;
            case 4:
                return this.spriteRAM[this.spriteAddress];
            case 7:
                let tmp = 0;
                if ((this.address & 0xFF00) === 0x3F00) {
                    tmp = this.palette[this.address & 0x1F];

                    this.ppuReadBuffer = this.memoryMap.getPPUByte(Clock, this.address - 4096);
                } else {
                    tmp = this.ppuReadBuffer;
                    if (this.address >= 0x2000 && this.address <= 0x2FFF) {
                        this.ppuReadBuffer = this.memoryMap.getPPUByte(Clock, this.address);
                    } else {
                        this.ppuReadBuffer = this.memoryMap.getPPUByte(Clock, this.address & 0x3FFF);
                    }
                }
                if ((this.controlByte0 & 4) === 4) {
                    this.address = this.address + 32;
                } else {
                    this.address = this.address + 1;
                }
                this.address = (this.address & 0x3FFF);
                return tmp;
        }
        return 0;
    }


    copySprites(copyFrom: number): void {
        for (var i = 0; i < 256; ++i) {
            var spriteLocation = (this.spriteAddress + i) & 255;
            if (this.spriteRAM[spriteLocation] !== this.memoryMap.Rams[copyFrom + i]) {
                this.spriteRAM[spriteLocation] = this.memoryMap.Rams[copyFrom + i];
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
                if ((this.controlByte0 & 8) === 8) {
                    spritePatternTable = 4096;
                }
                xPos = this.currentXPosition - currSprite.XPosition;
                yLine = this.currentYPosition - currSprite.YPosition - 1;

                yLine = yLine & (this.spriteSize - 1);

                tileIndex = currSprite.TileIndex;

                if ((this.controlByte0 & 32) === 32) {
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

                patternEntry = this.memoryMap.getPPUByte(0, spritePatternTable + tileIndex * 16 + yLine);
                patternEntryBit2 = this.memoryMap.getPPUByte(0, spritePatternTable + tileIndex * 16 + yLine + 8);

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
        patternEntry = this.memoryMap.getPPUByte(this.LastcpuClock, dataAddress);
        patternEntryBit2 = this.memoryMap.getPPUByte(this.LastcpuClock, dataAddress + 8);

        return (sprite.v.FlipX ? ((patternEntry >> x) & 1) | (((patternEntryBit2 >> x) << 1) & 2) : ((patternEntry >> 7 - x) & 1) | (((patternEntryBit2 >> 7 - x) << 1) & 2));
    }
    
    preloadSprites(scanline: number): void {
        this.spritesOnThisScanline = 0;
        this.sprite0scanline = -1;

        let yLine = this.currentYPosition - 1;

        for (let spriteNum = 0; spriteNum < 256; spriteNum += 4) {
            const spriteID = ((spriteNum + this.spriteAddress) & 0xff) >> 2;

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
            this.status = this.status | 32;
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
        const LookUp = this.memoryMap.getPPUByte(0, 8192 + ppuNameTableMemoryStart + 960 + (i >> 2) + ((j >> 2) * 8));

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

    ntLatch = 0;
    attrLatch = 0;
    patternLatchLow = 0;
    patternLatchHigh = 0;
    tileShiftRegister0 = 0;
    tileShiftRegister1 = 0;

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

                    if ((this.controlByte1 & 0x18) !== 0) {
                        this.oddFrame = !this.oddFrame;
                        this.isRendering = true;
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
                    this.status = 0;
                    this.hitSprite = false;
                    this.spriteSize = ((this.controlByte0 & 0x20) === 0x20) ? 16 : 8;
                    if (this.spriteChanges) {
                        this.unpackSprites();
                        this.spriteChanges = false;
                    }
                    this.frameOn = true;
                    if (this.oddFrame) this.frameClock++;
                    
                    break;
            }

            if (this.frameOn) {

                if (this.currentXPosition < 256)  {
                    switch (this.currentXPosition % 8) {
                        case 0:  // dont inc horizv on clock 0, only 8, 16, 24...
                            if (this.currentXPosition) {
                                // Inc hori(v)
                            }    
                        break;
                        case 1: // load nametable byte (2 clocks)
                            let ppuNameTableMemoryStart = this.nameTableMemoryStart ^ this.xNTXor ^ this.yNTXor;
                            let xTilePosition = this.xPosition >> 3;

                            const tileRow = (this.yPosition >> 3) % 30 << 5;

                            const tileNametablePosition = 0x2000 + ppuNameTableMemoryStart + xTilePosition + tileRow;

                            let tileIndex = this.memoryMap.getPPUByte(this.LastcpuClock + ticks, tileNametablePosition);                            // ntLatch = this.getNextNameTableByte
                            break;
                        case 3: // load attribute byte
                            // ntLatch = this.getNextAttributeByte
                            break;
                        case 5: // low pattern byte
                            // ntLatch = this.getNextPatternLow
                            break;
                        case 7: // high pattern byte
                            // ntLatch = this.getNextPatternHigh
                            break;
                        }


                    if ((this.xPosition & 7) === 0) {
                        this.xNTXor = (this.xPosition & 0x100) ? 0x400 : 0;
                        this.xPosition &= 0xFF;

                        /* fetch next tile */
                        let ppuNameTableMemoryStart = this.nameTableMemoryStart ^ this.xNTXor ^ this.yNTXor;
                        let xTilePosition = this.xPosition >> 3;

                        const tileRow = (this.yPosition >> 3) % 30 << 5;

                        const tileNametablePosition = 0x2000 + ppuNameTableMemoryStart + xTilePosition + tileRow;

                        let tileIndex = this.memoryMap.getPPUByte(this.LastcpuClock + ticks, tileNametablePosition);

                        let patternTableYOffset = this.yPosition & 7;

                        let patternID = this.backgroundPatternTableIndex + (tileIndex * 16) + patternTableYOffset;

                        this.patternEntry = this.memoryMap.getPPUByte(this.LastcpuClock + ticks, patternID);
                        this.patternEntryByte2 = this.memoryMap.getPPUByte(this.LastcpuClock + ticks, patternID + 8);

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
                        this.status = this.status | 64;
                    }


                    this.byteOutBuffer[this.vbufLocation * 4] = this.palette[(this.isForegroundPixel || (tilePixel === 0 && spritePixel !== 0)) ? spritePixel : tilePixel];
                    this.byteOutBuffer[(this.vbufLocation * 4) + 1] = this.emphasisBits;
                    this.vbufLocation++;
                }

                this.currentXPosition++;

                if (this.currentXPosition > 340) {

                    this.currentXPosition = 0;
                    this.currentYPosition++;

                    this.preloadSprites(this.currentYPosition);
                    if (this.spritesOnThisScanline >= 7) {
                        this.status = this.status | 32;
                    }

                    this.lockedHScroll = this.hScroll;
                    this.memoryMap.advanceScanline(1);

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

    // get state(): IChiChiPPUState {
    //     return {
    //         controlByte0:  this.controlByte0,
    //         controlByte1:  this.controlByte1,
    //         address: this.address,
    //         status: this.status,
    //         spriteAddress: this.spriteAddress,
    //         currentXPosition: this.currentXPosition,
    //         currentYPosition: this.currentYPosition,
    //         hScroll: this.hScroll,
    //         vScroll: this.vScroll,
    //         lockedHScroll: this.lockedHScroll,
    //         lockedVScroll: this.lockedVScroll,           
    //         spriteRAM:  this.spriteRAM.slice()
    //     };
    // }

    // set state(value: IChiChiPPUState) {
    //     this.controlByte0 = value.controlByte0;
    //     this.controlByte1  = value.controlByte1;

    //     this.address = value.address;
    //     this.status = value.status;
    //     this.spriteAddress = value.spriteAddress;
    //     this.currentXPosition = value.currentXPosition;
    //     this.currentYPosition = value.currentYPosition;
    //     this.hScroll = value.hScroll;
    //     this.vScroll = value.vScroll;
    //     this.lockedHScroll = value.lockedHScroll;
    //     this.lockedVScroll = value.lockedVScroll;

    //     for (let i = 0; i < this.spriteRAM.length; ++i) {
    //         this.spriteRAM[i] = value.spriteRAM[i];
    //     }


    //     this.nameTableBits = this.controlByte0 & 3;
    //     this.backgroundPatternTableIndex = ((this.controlByte0 & 16) >> 4) * 0x1000;

    //     this.greyScale = (this.controlByte1 & 0x1) === 0x1;
    //     this.emphasisBits = (this.controlByte1 >> 5) & 7;
    //     this._spritesAreVisible = (this.controlByte1 & 0x10) === 0x10;
    //     this._tilesAreVisible = (this.controlByte1 & 0x08) === 0x08;
    //     this._clipTiles = (this.controlByte1 & 0x02) !== 0x02;
    //     this._clipSprites = (this.controlByte1 & 0x04) !== 0x04;

    // }

    setupStateBuffer(sb: StateBuffer) {
        sb.onRestore.subscribe((buffer: StateBuffer) => {
             this.attachStateBuffer(buffer);
        })
        sb.onUpdateBuffer.subscribe((buffer)=> {
             this.updateStateBuffer(buffer);
        })

        sb  .pushSegment(256 * Uint8Array.BYTES_PER_ELEMENT, 'spriteram')
            .pushSegment(2, 'ppuaddress')
            .pushSegment(2, 'spriteaddress')
            .pushSegment(2, 'ppucontrolbytes')
            .pushSegment(2, 'ppustatus')
            .pushSegment(2, 'hvscroll')
            .pushSegment(2, 'lockedhvscroll')
            ;
        return sb;

    }

    attachStateBuffer(sb: StateBuffer) {
        let seg = sb.getSegment('spriteram');
        
        this.spriteRAM = new Uint8Array(seg.buffer, seg.start, seg.size);
        this.address = sb.getUint16Array('ppuaddress')[0];
        this.spriteAddress = sb.getUint8Array('spriteaddress')[0]; 
        
        const cbytes = sb.getUint8Array('ppucontrolbytes');
        this.controlByte0 = cbytes[0];
        this.controlByte1 = cbytes[1];
        this.status = sb.getUint8Array('ppustatus')[0];

        const scroll = sb.getUint8Array('hvscroll');
        this.hScroll = scroll[0];
        this.vScroll = scroll[1];

        const lscroll = sb.getUint8Array('lockedhvscroll');
        this.lockedHScroll = lscroll[0];
        this.lockedVScroll = lscroll[1];

        this.nameTableBits = this.controlByte0 & 3;
        this.backgroundPatternTableIndex = ((this.controlByte0 & 16) >> 4) * 0x1000;

        this.greyScale = (this.controlByte1 & 0x1) === 0x1;
        this.emphasisBits = (this.controlByte1 >> 5) & 7;
        this._spritesAreVisible = (this.controlByte1 & 0x10) === 0x10;
        this._tilesAreVisible = (this.controlByte1 & 0x08) === 0x08;
        this._clipTiles = (this.controlByte1 & 0x02) !== 0x02;
        this._clipSprites = (this.controlByte1 & 0x04) !== 0x04;

    }

    updateStateBuffer(sb: StateBuffer) {
        sb.getUint16Array('ppuaddress')[0] = this.address;
        sb.getUint8Array('spriteaddress')[0] = this.spriteAddress; 
        
        const cbytes = sb.getUint8Array('ppucontrolbytes');
        cbytes[0] = this.controlByte0;
        cbytes[1] = this.controlByte1;
        sb.getUint8Array('ppustatus')[0] = this.status;

        const scroll = sb.getUint8Array('hvscroll');
        scroll[0] = this.hScroll;
        scroll[1] = this.vScroll;

        const lscroll = sb.getUint8Array('lockedhvscroll');
        lscroll[0] = this.lockedHScroll;
        lscroll[1] = this.lockedVScroll;

    }

} 