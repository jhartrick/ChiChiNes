import { BaseCart } from './ChiChiCarts'
import { ChiChiSprite, PpuStatus } from './ChiChiTypes'
import { ChiChiCPPU } from "./ChiChiMachine";
import { ChiChiBopper } from "./ChiChiAudio";

export class ChiChiMemMap {
    cpu: ChiChiCPPU;
    ppu: ChiChiPPU;
    apu: ChiChiBopper;
    cart: BaseCart;

    getByte(address: number): number {
        return 0;
    }
    setByte(address: number, data: number) {
    }
}

export class ChiChiPPU {
    public static pal: Uint32Array = new Uint32Array([7961465, 10626572, 11407400, 10554206, 7733552, 2753820, 725017, 271983, 278855, 284436, 744967, 3035906, 7161605, 0, 131586, 131586, 12566719, 14641430, 15614283, 14821245, 12196292, 6496468, 2176980, 875189, 293472, 465210, 1597716, 5906953, 11090185, 2961197, 197379, 197379, 16316149, 16298569, 16588080, 16415170, 15560682, 12219892, 7115511, 4563694, 2277591, 2151458, 4513360, 1957181, 14604331, 6579811, 263172, 263172, 16447992, 16441012, 16634316, 16500447, 16236786, 14926838, 12831991, 11393781, 2287340, 5500370, 11858360, 14283440, 15921318, 13158344, 328965, 328965, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    public LastcpuClock: number = 0;

    // events
    NMIHandler: () => void;
    public frameFinished: () => void;
    cpu: ChiChiCPPU;
    constructor() {
    }

    // Rom handler
    chrRomHandler: BaseCart;
    
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

    private isForegroundPixel: boolean = false;

    private spriteChanges: boolean = false;

    private ppuReadBuffer: number = 0;
    private _clipSprites: boolean = false;
    private _clipTiles: boolean = false;
    private _tilesAreVisible: boolean = false;
    private _spritesAreVisible: boolean = false;

    private nameTableMemoryStart: number = 0;

    backgroundPatternTableIndex: number = 0;


    set ChrRomHandler(value: BaseCart) {
        this.chrRomHandler = value;
    }
    get ChrRomHandler(): BaseCart {
        return this.chrRomHandler;
    }

    PPU_IRQAsserted: boolean;

    get NextEventAt(): number {

        if (this.frameClock < 6820) {
            return (6820 - this.frameClock) / 3;
        } else {
            return (((89345 - this.frameClock) / 341) / 3);
        }
        //}
        //else
        //{
        //    return (6823 - frameClock) / 3;
        //}

    }

    PPU_SpriteCopyHasHappened: boolean;
    PPU_MaxSpritesPerScanline: number;

    PPU_SpriteRam: number[];
    SpritesOnLine: number[];

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

    get PPU_FrameFinishHandler(): () => void {
        return this.frameFinished;
    }
    set PPU_FrameFinishHandler(value: () => void) {
        this.frameFinished = value;
    }


    get PPU_NameTableMemoryStart(): number {
        return this.nameTableMemoryStart;
    }

    set PPU_NameTableMemoryStart(value: number) {
        this.nameTableMemoryStart = value;
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
    spriteRAM = new Uint8Array(<any>this.spriteRAMBuffer);// System.Array.init(256, 0, System.Int32);
    private spritesOnLine = new Array<number>(512);// System.Array.init(512, 0, System.Int32);
    private currentTileIndex = 0;
    private fetchTile = true;

    // tile bytes currently latched in ppu
    private patternEntry = 0; private patternEntryByte2 = 0;

    //
    private outBuffer = new Uint8Array(65536);

    // 'internal

    public byteOutBuffer = new Uint8Array(256 * 256 * 4);// System.Array.init(262144, 0, System.Int32);

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

    SetupVINT(): void {
        this._PPUStatus = this._PPUStatus | 128;
        //this.NMIHasBeenThrownThisFrame = false;
        // HandleVBlankIRQ = true;
        this._frames = this._frames + 1;
        //isRendering = false;

        if (this.NMIIsThrown) {
            this.NMIHandler();
            //this._handleNMI = true;
            //this.HandleVBlankIRQ = true;
            //this.NMIHasBeenThrownThisFrame = true;
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
    UpdatePPUControlByte0(): void {
        if ((this._PPUControlByte0 & 16)) {
            this.backgroundPatternTableIndex = 4096;
        } else {
            this.backgroundPatternTableIndex = 0;
        }
    }
    SetByte(Clock: number, address: number, data: number): void {
        // DrawTo(Clock);
        //if (_isDebugging)
        //{
        //    Events.Enqueue(new PPUWriteEvent { IsWrite = true, DataWritten = data, FrameClock = frameClock, RegisterAffected = address, ScanlineNum = frameClock / 341, ScanlinePos = frameClock % 341 });
        //}
        //Writable 2C02 registers
        //-----------------------

        //4 	-	returns object attribute memory 
        //      location indexed by port 3, then increments port 3.

        //6	    -	PPU address port to access with port 7.

        //7	    -	PPU memory write port.


        switch (address & 7) {
            case 0:
                this.DrawTo(Clock);
                this._PPUControlByte0 = data;
                this._openBus = data;
                this.nameTableBits = this._PPUControlByte0 & 3;
                this.backgroundPatternTableIndex = ((this._PPUControlByte0 & 16) >> 4) * 0x1000;
                // if we toggle /vbl we can throw multiple NMIs in a vblank period
                //if ((data & 0x80) == 0x80 && NMIHasBeenThrownThisFrame)
                //{
                //     NMIHasBeenThrownThisFrame = false;
                //}
                //UpdatePixelInfo();
                this.nameTableMemoryStart = this.nameTableBits * 0x400;
                break;
            case 1:
                //1	    0	disable composite colorburst (when 1). Effectively causes gfx to go black & white.
                //      1	left side screen column (8 pixels wide) playfield clipping (when 0).
                //      2	left side screen column (8 pixels wide) object clipping (when 0).
                //      3	enable playfield display (on 1).
                //      4	enable objects display (on 1).
                //      5	R (to be documented)
                //      6	G (to be documented)
                //      7	B (to be documented)
                this.DrawTo(Clock);
                this.isRendering = (data & 0x18) !== 0;
                this._PPUControlByte1 = data;
                this._spritesAreVisible = (this._PPUControlByte1 & 0x10) === 0x10;
                this._tilesAreVisible = (this._PPUControlByte1 & 0x08) === 0x08;
                this._clipTiles = (this._PPUControlByte1 & 0x02) !== 0x02;
                this._clipSprites = (this._PPUControlByte1 & 0x04) !== 0x04;
                //UpdatePixelInfo();
                this.nameTableMemoryStart = this.nameTableBits * 0x400;
                break;
            case 2:
                this.ppuReadBuffer = data;
                this._openBus = data;
                break;
            case 3:
                //3	    -	internal object attribute memory index pointer 
                //          (64 attributes, 32 bits each, byte granular access). 
                //          stored value post-increments on access to port 4.
                this._spriteAddress = data & 0xFF;
                this._openBus = this._spriteAddress;
                break;
            case 4:
                this.spriteRAM[this._spriteAddress] = data;
                // UnpackSprite(_spriteAddress / 4);
                this._spriteAddress = (this._spriteAddress + 1) & 255;
                this.unpackedSprites[this._spriteAddress >> 2].Changed = true;
                this.spriteChanges = true;
                break;
            case 5:
                //5	    -	scroll offset port.
                // on 1st read (high), bits 0,1,2 go to fine horizonal scroll, rest to select tile
                // on 2nd read, bits 0,1,2 go to fine vertical scroll, rest to select tile
                // during render, writes to FH are applied immediately
                if (this.PPUAddressLatchIsHigh) {
                    //if (isRendering)
                    //{
                    //    fineHorizontalScroll = data & 0x7;
                    //    horizontalTileIndex = data >> 3;
                    //}  
                    this.DrawTo(Clock);
                    this._hScroll = data;

                    this.lockedHScroll = this._hScroll & 7;
                    this.UpdatePixelInfo();

                    this.PPUAddressLatchIsHigh = false;
                } else {
                    // during rendering, a write here will not post to the rendering counter
                    this.DrawTo(Clock);
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
                //Since the PPU's external address bus is only 14 bits in width, 
                //the top two bits of the value written are ignored. 
                if (this.PPUAddressLatchIsHigh) {
                    //            //a) Write upper address byte into $2006
                    this._PPUAddress = (this._PPUAddress & 0xFF) | ((data & 0x3F) << 8);
                    this.PPUAddressLatchIsHigh = false;
                } else {
                    //            //b) Write lower address byte into $2006
                    this._PPUAddress = (this._PPUAddress & 0x7F00) | data & 0xFF;
                    this.PPUAddressLatchIsHigh = true;

                    // writes here during rendering directly affect the scroll counter
                    // from Marat Fazulamans doc

                    //Address Written into $2006
                    //xxYYSSYYYYYXXXXX
                    //   | |  |     |
                    //   | |  |     +---- Horizontal scroll in tiles (i.e. 1 = 8 pixels)
                    //   | |  +--------- Vertical scroll in tiles (i.e. 1 = 8 pixels)
                    //   | +------------ Number of Name Table ($2000,$2400,$2800,$2C00)
                    //   +-------------- Additional vertical scroll in pixels (0..3)

                    // on second write during frame, loopy t (_hscroll, _vscroll) is copied to loopy_v (lockedHscroll, lockedVScroll)

                    this.DrawTo(Clock);
                    this._hScroll = ((this._PPUAddress & 0x1F) << 3); // +(currentXPosition & 7);
                    this._vScroll = (((this._PPUAddress >> 5) & 0x1F) << 3);
                    this._vScroll |= ((this._PPUAddress >> 12) & 3);

                    this.nameTableBits = ((this._PPUAddress >> 10) & 3);
                    if (this.frameOn) {

                        this.lockedHScroll = this._hScroll;
                        this.lockedVScroll = this._vScroll;
                        this.lockedVScroll = this.lockedVScroll - this.currentYPosition;
                    }
                    this.UpdatePixelInfo();
                    // relock vscroll during render when this happens
                }
                break;
            case 7:
                //            //Writing to PPU memory:
                //            //c) Write data into $2007. After each write, the
                //            //   address will increment either by 1 (bit 2 of
                //            //   $2000 is 0) or by 32 (bit 2 of $2000 is 1).
                // ppuLatch = data;
                if ((this._PPUAddress & 0xFF00) === 0x3F00) {
                    this.DrawTo(Clock);
                    //WriteToNESPalette(_PPUAddress, (byte)data);
                    var palAddress = (this._PPUAddress) & 0x1F;
                    this._palette[palAddress] = data;
                    // rgb32OutBuffer[255 * 256 + palAddress] = data;
                    if ((this._PPUAddress & 0xFFEF) === 0x3F00) {
                        this._palette[(palAddress ^ 16) & 0x1F] = data;
                    }
                    // these palettes are all mirrored every 0x10 bytes
                    this.UpdatePixelInfo();
                } else {
                    // if its a nametable byte, mask it according to current mirroring
                    if ((this._PPUAddress & 0xF000) === 0x2000) {
                        this.chrRomHandler.SetPPUByte(Clock, this._PPUAddress, data);
                    } else {
                        if (this.vidRamIsRam) {
                            this.chrRomHandler.SetPPUByte(Clock, this._PPUAddress, data);
                        }
                    }
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
        //if (_isDebugging)
        //{
        //    Events.Enqueue(new PPUWriteEvent { IsWrite = false, DataWritten = 0, FrameClock = frameClock, RegisterAffected = address, ScanlineNum = frameClock / 341, ScanlinePos = frameClock % 341 });
        //}

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
                // bit 7 is set to 0 after a read occurs
                // return lower 5 latched bits, and the status
                ret = (this.ppuReadBuffer & 0x1F) | this._PPUStatus;

                this.DrawTo(Clock);
                if ((ret & 0x80) === 0x80) {
                    this._PPUStatus = this._PPUStatus & ~0x80;
                }
                this.UpdatePixelInfo();
                //}
                //this._openBus = ret;
                return ret;
            case 4:
                var tmp = this.spriteRAM[this._spriteAddress];
                //ppuLatch = spriteRAM[SpriteAddress];
                // should not increment on read ?
                //SpriteAddress = (SpriteAddress + 1) & 0xFF;
                //this._openBus = tmp;
                return tmp;
            case 7:

                // palette reads shouldn't be buffered like regular vram reads, they re internal
                if ((this._PPUAddress & 0xFF00) === 0x3F00) {
                    // these palettes are all mirrored every 0x10 bytes
                    tmp = this._palette[this._PPUAddress & 0x1F];
                    // palette read should also read vram into read buffer

                    // info i found on the nesdev forums

                    // When you read PPU $3F00-$3FFF, you get immediate data from Palette RAM 
                    // (without the 1-read delay usually present when reading from VRAM) and the PPU 
                    // will also fetch nametable data from the corresponding address (which is mirrored from PPU $2F00-$2FFF). 

                    // note: writes do not work this way 
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
    HandleEvent(Clock: number): void {
        this.DrawTo(Clock);
    }
    ResetClock(Clock: number): void {
        this.LastcpuClock = Clock;
    }
    CopySprites(copyFrom: number): void {

        // should copy 0x100 items from source to spriteRAM, 
        // starting at SpriteAddress, and wrapping around
        // should set spriteDMA flag
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
    InitSprites(): void {
        this.currentSprites = new Array<ChiChiSprite>(this._maxSpritesPerScanline); //ChiChiSprite;
        for (let i = 0; i < this._maxSpritesPerScanline; ++i) {
            this.currentSprites[i] = new ChiChiSprite();
        }

        this.unpackedSprites = new Array<ChiChiSprite>(64);

        for (let i = 0; i < 64; ++i) {
            this.unpackedSprites[i] = new ChiChiSprite();
        }

    }
    GetSpritePixel(): number {
        this.isForegroundPixel = false;
        this.spriteZeroHit = false;
        var result = 0;
        var yLine = 0;
        var xPos = 0;
        var tileIndex = 0;

        for (var i = 0; i < this.spritesOnThisScanline; ++i) {
            var currSprite = this.currentSprites[i];
            if (currSprite.XPosition > 0 && this.currentXPosition >= currSprite.XPosition && this.currentXPosition < currSprite.XPosition + 8) {

                var spritePatternTable = 0;
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

                //result = WhissaSpritePixel(spritePatternTable, xPos, yLine, ref currSprite, tileIndex);
                // 8x8 tile
                var patternEntry;
                var patternEntryBit2;

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
    WhissaSpritePixel(patternTableIndex: number, x: number, y: number, sprite: { v: ChiChiSprite; }, tileIndex: number): number {
        // 8x8 tile
        let patternEntry = 0;
        let patternEntryBit2 = 0;

        if (sprite.v.FlipY) {
            y = this.spriteSize - y - 1;
        }

        if (y >= 8) {
            y += 8;
        }

        patternEntry = this.chrRomHandler.GetPPUByte(0, patternTableIndex + tileIndex * 16 + y);
        patternEntryBit2 = this.chrRomHandler.GetPPUByte(0, patternTableIndex + tileIndex * 16 + y + 8);

        return (sprite.v.FlipX ? ((patternEntry >> x) & 1) | (((patternEntryBit2 >> x) << 1) & 2) : ((patternEntry >> 7 - x) & 1) | (((patternEntryBit2 >> 7 - x) << 1) & 2));
    }
    PreloadSprites(scanline: number): void {
        this.spritesOnThisScanline = 0;
        this.sprite0scanline = -1;

        let yLine = this.currentYPosition - 1;
        this.outBuffer[(64768) + yLine] = 0;
        this.outBuffer[(65024) + yLine] = 0;
        //spritesOnLine[2 * yLine] = 0;
        //spritesOnLine[2 * yLine + 1] = 0;
        for (var spriteNum = 0; spriteNum < 256; spriteNum += 4) {
            var spriteID = ((spriteNum + this._spriteAddress) & 255) >> 2;

            var y = this.unpackedSprites[spriteID].YPosition + 1;

            if (scanline >= y && scanline < y + this.spriteSize) {
                if (spriteID === 0) {
                    this.sprite0scanline = scanline;
                    this.sprite0x = this.unpackedSprites[spriteID].XPosition;
                }

                var spId = spriteNum >> 2;
                if (spId < 32) {
                    this.outBuffer[(64768) + yLine] |= 1 << spId;
                } else {
                    this.outBuffer[(65024) + yLine] |= 1 << (spId - 32);
                }

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
    UnpackSprites(): void {
        //Buffer.BlockCopy
        //var outBufferloc = 65280;
        //for (var i = 0; i < 256; i += 4) {
        //    this.outBuffer[outBufferloc] = (this.spriteRAM[i] << 24) | (this.spriteRAM[i + 1] << 16) | (this.spriteRAM[i + 2] << 8) | (this.spriteRAM[i + 3] << 0);
        //    outBufferloc++;
        //}
        // Array.Copy(spriteRAM, 0, outBuffer, 255 * 256 * 4, 256);
        for (var currSprite = 0; currSprite < this.unpackedSprites.length; ++currSprite) {
            if (this.unpackedSprites[currSprite].Changed) {
                this.UnpackSprite(currSprite);
            }
        }
    }
    UnpackSprite(currSprite: number): void {
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
    GetNameTablePixel(): number {
        var result = ((this.patternEntry & 128) >> 7) | ((this.patternEntryByte2 & 128) >> 6);
        this.patternEntry <<= 1;
        this.patternEntryByte2 <<= 1;
        if (result > 0) {
            result |= this.currentAttributeByte;
        }
        return result & 255;
    }
    FetchNextTile(): void {
        let ppuNameTableMemoryStart = this.nameTableMemoryStart ^ this.xNTXor ^ this.yNTXor;

        let xTilePosition = this.xPosition >> 3;

        let tileRow = (this.yPosition >> 3) % 30 << 5;

        let tileNametablePosition = 8192 + ppuNameTableMemoryStart + xTilePosition + tileRow;

        let TileIndex = this.chrRomHandler.GetPPUByte(0, tileNametablePosition);

        let patternTableYOffset = this.yPosition & 7;

        let patternID = this.backgroundPatternTableIndex + (TileIndex * 16) + patternTableYOffset;

        this.patternEntry = this.chrRomHandler.GetPPUByte(0, patternID);
        this.patternEntryByte2 = this.chrRomHandler.GetPPUByte(0, patternID + 8);

        this.currentAttributeByte = this.GetAttributeTableEntry(ppuNameTableMemoryStart, xTilePosition, this.yPosition >> 3);
    }

    GetAttributeTableEntry(ppuNameTableMemoryStart: number, i: number, j: number): number {
        let LookUp = this.chrRomHandler.GetPPUByte(0, 8192 + ppuNameTableMemoryStart + 960 + (i >> 2) + ((j >> 2) * 8));

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

    DrawTo(cpuClockNum: number): void {
        let frClock = (cpuClockNum - this.LastcpuClock) * 3;

        if (this.frameClock < 6820) {
            // if the frameclock +frClock is in vblank (< 6820) dont do nothing, just update it
            if (this.frameClock + frClock < 6820) {
                this.frameClock += frClock;
                frClock = 0;
            } else {
                //find number of pixels to draw since frame start
                frClock += this.frameClock - 6820;
                this.frameClock = 6820;
            }
        }
        for (var i = 0; i < frClock; ++i) {
            switch (this.frameClock++) {
                case 0:
                    break;
                case 6820:
                    this._PPUStatus = 0;
                    this.hitSprite = false;
                    this.spriteSize = ((this._PPUControlByte0 & 0x20) === 0x20) ? 16 : 8;
                    if ((this._PPUControlByte1 & 0x18) !== 0) {
                        this.isRendering = true;
                    }
                    this.frameOn = true;
                    this.chrRomHandler.ResetBankStartCache();
                    // setFrameOn();
                    if (this.spriteChanges) {
                        this.UnpackSprites();
                        this.spriteChanges = false;
                    }
                    break;
                case 7161:
                    //lockedVScroll = _vScroll;
                    this.vbufLocation = 0;
                    //curBufPos = bufStart;
                    this.xNTXor = 0;
                    this.yNTXor = 0;
                    this.currentXPosition = 0;
                    this.currentYPosition = 0;
                    break;
                case 89342://ChiChiNES.CPU2A03.frameClockEnd:
                    this.shouldRender = true;
                    //__frameFinished = true;
                    this.frameFinished();
                    this.SetupVINT();
                    this.frameOn = false;
                    this.frameClock = 0;
                    //if (_isDebugging)
                    //    events.Clear();
                    break;
            }

            if (this.frameClock >= 7161 && this.frameClock <= 89342) {


                if (this.currentXPosition < 256 && this.vbufLocation < 61440) {
                    /* update x position */
                    this.xPosition = this.currentXPosition + this.lockedHScroll;


                    if ((this.xPosition & 7) === 0) {
                        this.xNTXor = (this.xPosition & 0x100) ? 0x400 : 0;
                        this.xPosition &= 0xFF;

                        /* fetch next tile */
                        let ppuNameTableMemoryStart = this.nameTableMemoryStart ^ this.xNTXor ^ this.yNTXor;
                        let xTilePosition = this.xPosition >> 3;

                        const tileRow = (this.yPosition >> 3) % 30 << 5;

                        const tileNametablePosition = 0x2000 + ppuNameTableMemoryStart + xTilePosition + tileRow;

                        let TileIndex = this.chrRomHandler.GetPPUByte(0, tileNametablePosition);

                        let patternTableYOffset = this.yPosition & 7;

                        let patternID = this.backgroundPatternTableIndex + (TileIndex * 16) + patternTableYOffset;

                        this.patternEntry = this.chrRomHandler.GetPPUByte(0, patternID);
                        this.patternEntryByte2 = this.chrRomHandler.GetPPUByte(0, patternID + 8);

                        this.currentAttributeByte = this.GetAttributeTableEntry(ppuNameTableMemoryStart, xTilePosition, this.yPosition >> 3);
                        /* end fetch next tile */

                    }

                    /* draw pixel */
                    const tilePixel = this._tilesAreVisible ? this.GetNameTablePixel() : 0;
                    // bool foregroundPixel = isForegroundPixel;
                    const spritePixel = this._spritesAreVisible ? this.GetSpritePixel() : 0;

                    if (!this.hitSprite && this.spriteZeroHit && tilePixel !== 0) {
                        this.hitSprite = true;
                        this._PPUStatus = this._PPUStatus | 64;
                    }

                    //var x = pal[_palette[(foregroundPixel || (tilePixel == 0 && spritePixel != 0)) ? spritePixel : tilePixel]];
                    //var x = 

                    this.byteOutBuffer[this.vbufLocation * 4] = this._palette[(this.isForegroundPixel || (tilePixel === 0 && spritePixel !== 0)) ? spritePixel : tilePixel];
                    //byteOutBuffer[(vbufLocation * 4) + 1] = x;// (byte)(x >> 8);
                    //byteOutBuffer[(vbufLocation * 4) + 2] = x;//  (byte)(x >> 16);
                    //byteOutBuffer[(vbufLocation * 4) + 3] = 0xFF;// (byte)(x);// (byte)rgb32OutBuffer[vbufLocation];

                    this.vbufLocation++;
                }
                if (this.currentXPosition === 324) {
                    this.chrRomHandler.UpdateScanlineCounter();
                }
                this.currentXPosition++;

                if (this.currentXPosition > 340) {

                    this.currentXPosition = 0;
                    this.currentYPosition++;

                    this.PreloadSprites(this.currentYPosition);
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

        }
        this.LastcpuClock = cpuClockNum;
    }

    UpdatePixelInfo(): void {
        this.nameTableMemoryStart = this.nameTableBits * 0x400;
    }

} 