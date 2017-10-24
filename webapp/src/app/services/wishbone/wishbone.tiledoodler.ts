import { ChiChiCPPU } from "../../../../workers/chichi/ChiChi.HWCore";

export class TileDoodler {
    static powersOfTwo = [1, 2, 4, 8, 6, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192];
    currentNameTableEntries: Array<Array<Uint8Array>> = null;
    currentPatternTableEntries: Array<Array<Array<Uint8Array>>> = null;
    XOffset = 0;
    YOffset = 0;

    constructor(private ppu: any) {
        this.currentPatternTableEntries = new Array<Array<Array<Uint8Array>>>(2);
        for (let pt = 0; pt < 2; pt++) {
            this.currentPatternTableEntries[pt] = new Array<Array<Uint8Array>>(32);
            for (let x = 0; x < 32; x++) {
                this.currentPatternTableEntries[pt][x] = new Array<Uint8Array>(30);
                for (let y = 0; y < 30; y++) {
                    this.currentPatternTableEntries[pt][x][y] = new Uint8Array(8);
                    this.currentPatternTableEntries[pt][x][y].fill(0);
                }
            }
        }

        this.currentNameTableEntries = new Array<Array<Uint8Array>>(32);
        for (let i = 0; i < 32; i++) {
            this.currentNameTableEntries[i] = new Array<Uint8Array>(30);
            for (let j = 0; j < 30; j++) {
                this.currentNameTableEntries[i][j] = new Uint8Array(8); 
                this.currentNameTableEntries[i][j].fill(0);
            }
        }
    }

    GetPatternTableEntry (PatternTable: number, TileIndex: number, attributeByte: number, actualAddress: any): Uint8Array {
                // 8x8 tile
                const result = new Uint8Array(64); // System.Array.init(64, 0, System.Int32);
                result.fill(0);

                //actualAddress = new Uint8Array(8); // 8, 0, System.Int32);
                //actualAddress.fill(0);

                for (let  i = 0; i < 8; i++) {
                    const entryLoc = (PatternTable + (TileIndex << 4))  + i;
                    const patternEntry = this.ppu.ChrRomHandler.GetPPUByte(0, entryLoc);

                    actualAddress[i] = this.ppu.ChrRomHandler.ActualChrRomOffset(entryLoc);

                    const patternEntryBit2 = this.ppu.ChrRomHandler.GetPPUByte(0, entryLoc + 8);

                    for (let bit = 0; bit < 8; bit = (bit + 1) | 0) {
                        if ((patternEntry & TileDoodler.powersOfTwo[bit]) !== 0) {
                            result[(((i * 8)) + bit) ] = 1 | attributeByte;
                        }
                        if ((patternEntryBit2 & TileDoodler.powersOfTwo[bit]) !== 0) {
                            const resultLoc = (i * 8 ) + bit;
                            result[resultLoc] = result[resultLoc] | (2 | attributeByte);
                        }
                    }

                }

                return result;
    }

        GetSprite (PatternTable, TileIndex, attributeByte, flipX, flipY): Uint8Array {
            // 8x8 tile
            const result = new Uint8Array(64);// System.Array.init(64, 0, System.Int32);
            const  yMultiplyer = 8;

            for (let i = 0; i < 8; i++) {
                let patternEntry = 0;
                let patternEntryBit2 = 0;
                if (flipY) {
                    patternEntry = this.ppu.VidRAM_GetNTByte(((PatternTable + (TileIndex * 16))  + 7)  - i );
                    patternEntryBit2 = this.ppu.VidRAM_GetNTByte((((PatternTable + (TileIndex * 16))  + 7)  - i) + 8);
                } else {

                    patternEntry = this.ppu.VidRAM_GetNTByte((PatternTable + (TileIndex * 16))  + i);
                    patternEntryBit2 = this.ppu.VidRAM_GetNTByte(((PatternTable + (TileIndex * 16)) + i) + 8);
                }
                if (flipX) {
                    for (let bit = 7; bit >= 0; bit-- ) {
                        if ((patternEntry & TileDoodler.powersOfTwo[bit]) !== 0) {
                            result[(((i * yMultiplyer) + 7)  - bit)] = 1 | attributeByte;
                        }
                        if ((patternEntryBit2 & TileDoodler.powersOfTwo[bit]) !== 0) {
                            const rPos = (((i * yMultiplyer) + 7)  - bit);
                            result[rPos] = result[rPos] | (2 | attributeByte);
                        }
                    }
                } else {
                    for (let bit1 = 0; bit1 < 8; bit1++) {
                        if ((patternEntry & TileDoodler.powersOfTwo[bit1]) !== 0) {
                            result[((((i * 8)) + bit1) | 0)] = 1 | attributeByte;
                        }
                        if ((patternEntryBit2 & TileDoodler.powersOfTwo[bit1]) !== 0) {
                            const pos = (i * 8) + bit1;
                            result[pos] = result[pos] | (2 | attributeByte);
                        }
                    }
                }
            }
            return result;
        }

    //         TryGetSprite: function (result, PatternTable, TileIndex, attributeByte, flipX, flipY) {
    //             var $t, $t1, $t2, $t3, $t4, $t5;
    //             // 8x8 tile
    //             var yMultiplyer = 8;
    //             var hasData = false;

    //             for (var i = 0; i < 8; i = (i + 1) | 0) {
    //                 var patternEntry;
    //                 var patternEntryBit2;
    //                 if (flipY) {
    //                     patternEntry = this.ppu.ChiChiNES$IPPU$VidRAM_GetNTByte(((((((PatternTable + Bridge.Int.mul(TileIndex, 16)) | 0) + 7) | 0) - i) | 0));
    //                     patternEntryBit2 = this.ppu.ChiChiNES$IPPU$VidRAM_GetNTByte(((((((((PatternTable + Bridge.Int.mul(TileIndex, 16)) | 0) + 7) | 0) - i) | 0) + 8) | 0));
    //                 } else {
    //                     patternEntry = this.ppu.ChiChiNES$IPPU$VidRAM_GetNTByte(((((PatternTable + Bridge.Int.mul(TileIndex, 16)) | 0) + i) | 0));
    //                     patternEntryBit2 = this.ppu.ChiChiNES$IPPU$VidRAM_GetNTByte(((((((PatternTable + Bridge.Int.mul(TileIndex, 16)) | 0) + i) | 0) + 8) | 0));
    //                 }

    //                 if (flipX) {
    //                     for (var bit = 7; bit >= 0; bit = (bit - 1) | 0) {
    //                         result[(((((Bridge.Int.mul(i, yMultiplyer)) + 7) | 0) - bit) | 0)] = 0;
    //                         if ((patternEntry & ($t = ChiChiNES.PixelWhizzler.PowersOfTwo)[bit]) !== 0) {
    //                             result[(((((Bridge.Int.mul(i, yMultiplyer)) + 7) | 0) - bit) | 0)] = 1 | attributeByte;
    //                             hasData = true;
    //                         }
    //                         if ((patternEntryBit2 & ($t1 = ChiChiNES.PixelWhizzler.PowersOfTwo)[bit]) !== 0) {
    //                             result[($t2 = (((((Bridge.Int.mul(i, yMultiplyer)) + 7) | 0) - bit) | 0))] = result[$t2] | (2 | attributeByte);
    //                             hasData = true;
    //                         }
    //                     }
    //                 } else {
    //                     for (var bit1 = 0; bit1 < 8; bit1 = (bit1 + 1) | 0) {
    //                         result[(((Bridge.Int.mul(i, 8)) + bit1) | 0)] = 0;
    //                         if ((patternEntry & ($t3 = ChiChiNES.PixelWhizzler.PowersOfTwo)[bit1]) !== 0) {
    //                             result[(((Bridge.Int.mul(i, 8)) + bit1) | 0)] = 1 | attributeByte;
    //                             hasData = true;
    //                         }
    //                         if ((patternEntryBit2 & ($t4 = ChiChiNES.PixelWhizzler.PowersOfTwo)[bit1]) !== 0) {
    //                             result[($t5 = (((Bridge.Int.mul(i, 8)) + bit1) | 0))] = result[$t5] | (2 | attributeByte);
    //                             hasData = true;
    //                         }
    //                     }
    //                 }
    //             }
    //             return hasData;
    //         },
    //         /**
    //          * Gets a 1x8 line from a particular pattern table
    //          *
    //          * @instance
    //          * @public
    //          * @this ChiChiNES.TileDoodler
    //          * @memberof ChiChiNES.TileDoodler
    //          * @param   {System.Int32}    result           
    //          * @param   {number}          startPosition    
    //          * @param   {number}          LineNumber       
    //          * @param   {number}          PatternTable     
    //          * @param   {number}          TileIndex        
    //          * @param   {number}          attributeByte
    //          * @return  {void}
    //          */
    //         GetPatternTableLine: function (result, startPosition, LineNumber, PatternTable, TileIndex, attributeByte) {
    //             var $t, $t1, $t2;
    //             // 8x8 tile

    //             var patternEntry = this.ppu.ChiChiNES$IPPU$VidRAM_GetNTByte(((((PatternTable + Bridge.Int.mul(TileIndex, 16)) | 0) + LineNumber) | 0));
    //             var patternEntryBit2 = this.ppu.ChiChiNES$IPPU$VidRAM_GetNTByte(((((((PatternTable + Bridge.Int.mul(TileIndex, 16)) | 0) + LineNumber) | 0) + 8) | 0));

    //             for (var bit = 0; bit < 8; bit = (bit + 1) | 0) {
    //                 if ((patternEntry & ($t = ChiChiNES.PixelWhizzler.PowersOfTwo)[bit]) !== 0) {
    //                     result.v[(((Bridge.Int.mul(LineNumber, 8)) + bit) | 0)] = 1 | attributeByte;
    //                 }
    //                 if ((patternEntryBit2 & ($t1 = ChiChiNES.PixelWhizzler.PowersOfTwo)[bit]) !== 0) {
    //                     result.v[($t2 = (((Bridge.Int.mul(LineNumber, 8)) + bit) | 0))] = result.v[$t2] | (2 | attributeByte);
    //                 }
    //             }
    //         },
        DrawRect (newData : any, width: number, height: number, xPos: number, yPos: number) {

            for (let j = 0; j < height; j = (j + 1) | 0) {
                for (let i = 0; i < width; i = (i + 1) | 0) {

                    const xPosition = (((xPos + 8) | 0) - i) | 0;
                    const yPosition = (yPos + j) | 0;

                    if (xPosition >= 256 || yPosition >= 240) {
                        return;
                    }
                    this.ppu.CurrentFrame[((yPosition * 256) + xPosition)] = newData[(j * width) + i];
                }
            }
        }
    //         MergeRect: function (newData, width, height, xPos, yPos, inFront) {
    //             var $t;

    //             if (inFront) {
    //                 this.MergeRectBehind(newData, width, height, xPos, yPos);
    //                 return;
    //             }

    //             for (var j = 0; j < height; j = (j + 1) | 0) {
    //                 for (var i = 0; i < width; i = (i + 1) | 0) {

    //                     var xPosition = (((xPos + 8) | 0) - i) | 0;
    //                     var yPosition = (yPos + j) | 0;

    //                     if (xPosition >= 256 || yPosition >= 240) {
    //                         return;
    //                     }
    //                     if (newData[(((Bridge.Int.mul(j, width)) + i) | 0)] !== 0) {
    //                         ($t = this.ppu.ChiChiNES$IPPU$CurrentFrame)[((Bridge.Int.mul(yPosition, 256) + xPosition) | 0)] = (this.ppu.ChiChiNES$IPPU$VidRAM_GetNTByte((((newData[(((Bridge.Int.mul(j, width)) + i) | 0)]) + 16128) | 0))) & 255;
    //                     }
    //                 }
    //             }
    //         },
    //         MergeRectBehind: function (newData, width, height, xPos, yPos) {
    //             var $t, $t1;

    //             for (var j = 0; j < height; j = (j + 1) | 0) {
    //                 for (var i = 0; i < width; i = (i + 1) | 0) {

    //                     var xPosition = (((xPos + 8) | 0) - i) | 0;
    //                     var yPosition = (yPos + j) | 0;

    //                     if (xPosition >= 256 || yPosition >= 240) {
    //                         return;
    //                     }
    //                     if (($t = this.ppu.ChiChiNES$IPPU$CurrentFrame)[((Bridge.Int.mul(yPosition, 256) + xPosition) | 0)] === this.ppu.ChiChiNES$IPPU$VidRAM_GetNTByte(16128)) {
    //                         ($t1 = this.ppu.ChiChiNES$IPPU$CurrentFrame)[((Bridge.Int.mul(yPosition, 256) + xPosition) | 0)] = (this.ppu.ChiChiNES$IPPU$VidRAM_GetNTByte((((newData[(((Bridge.Int.mul(j, width)) + i) | 0)]) + 16128) | 0))) & 255;
    //                     }
    //                 }
    //             }
    //         },

        DrawAllTiles () {
            if (this.YOffset > 256) {
                this.YOffset = this.YOffset & 255;
            }
            if (this.XOffset > 256) {
                this.XOffset = this.XOffset & 255;
            }

            const NameTable = 8192 + (1024 * (this.ppu.PPUControlByte0 & 3));
            const nt2 = ((NameTable & 3072) >> 10);

            for (let i = 0; i < 32; i++) {
                for (let j = 0; j < 30; j++) {
                    const TileIndex = this.ppu.VidRAM_GetNTByte(8192 + this.ppu.NameTableMemoryStart + i  + (j * 32));

                    const addToCol = this.GetAttributeTableEntry(this.ppu.NameTableMemoryStart, i, j);
                    this.DrawRect(
                        this.GetPatternTableEntry(
                            this.ppu.PatternTableIndex, TileIndex, addToCol, 
                            this.currentNameTableEntries[i][j]),
                                8, 8, (i * 8) + this.XOffset , (j * 8) + this.YOffset );

                }
            }
        }

        GetAttributeTableEntry (ppuNameTableMemoryStart: number, i: number, j: number) : number {

            const LookUp = this.ppu.VidRAM_GetNTByte((8192 + ppuNameTableMemoryStart)  + 960) + (i >> 2) + ((j >> 2) * 8);

            let AttribByte = 0;
            switch ((i & 2) | ((j & 2) * 2)) {
                case 0:
                    AttribByte = (LookUp << 2) & 12;
                    break;
                case 2:
                    AttribByte = LookUp & 12;
                    break;
                case 4:
                    AttribByte = (LookUp >> 2) & 12;
                    break;
                case 6:
                    AttribByte = (LookUp >> 4) & 12;
                    break;
            }
            return AttribByte;
        }
    //         /**
    //          * Returns a pixel
    //          *
    //          * @instance
    //          * @public
    //          * @this ChiChiNES.TileDoodler
    //          * @memberof ChiChiNES.TileDoodler
    //          * @param   {number}    xPosition    X position of pixel (0 to 255)
    //          * @param   {number}    yPosition    Y position of pixel (0 to 239)
    //          * @return  {number}
    //          */
    //         GetNameTablePixel: function (xPosition, yPosition) {
    //             var ppuNameTableMemoryStart = this.ppu.ChiChiNES$IPPU$NameTableMemoryStart;
    //             //yPosition += 1;
    //             xPosition = (xPosition + this.ppu.ChiChiNES$IPPU$HScroll) | 0;

    //             if (xPosition > 255) {
    //                 xPosition = (xPosition - 256) | 0;
    //                 // from loopy's doc
    //                 // you can think of bits 0,1,2,3,4 of the vram address as the "x scroll"(*8)
    //                 //that the ppu increments as it draws.  as it wraps from 31 to 0, bit 10 is
    //                 //switched.  you should see how this causes horizontal wrapping between name
    //                 //tables (0,1) and (2,3).

    //                 ppuNameTableMemoryStart = ppuNameTableMemoryStart ^ 1024;


    //             }
    //             var xTilePosition = (Bridge.Int.div(xPosition, 8)) | 0;
    //             // index of this pixels bit in pattern table
    //             var patternTableEntryIndex = (7 - (xPosition & 7)) | 0;

    //             yPosition = (yPosition + this.ppu.ChiChiNES$IPPU$VScroll) | 0;
    //             if (yPosition > 240) {
    //                 yPosition = (yPosition - 241) | 0;
    //                 ppuNameTableMemoryStart = ppuNameTableMemoryStart ^ 2048;
    //             }

    //             var yTilePosition = (Bridge.Int.div(yPosition, 8)) | 0;

    //             var patternTableYOffset = yPosition & 7;


    //             //int mirrorIndexLookup = (nameTableMemoryStart & 0xC00) / 0x400;
    //             //int TileIndex = (byte)ppu.NameTable[ppu.CurrentNameTable, xTilePosition + (yTilePosition * 32)];

    //             var TileIndex = (this.ppu.ChiChiNES$IPPU$VidRAM_GetNTByte(((((((8192 + ppuNameTableMemoryStart) | 0) + xTilePosition) | 0) + ((Bridge.Int.mul(yTilePosition, 32)))) | 0))) & 255;

    //             var patternEntry = this.ppu.ChiChiNES$IPPU$VidRAM_GetNTByte(((((this.ppu.ChiChiNES$IPPU$PatternTableIndex + Bridge.Int.mul(TileIndex, 16)) | 0) + patternTableYOffset) | 0));
    //             var patternEntryByte2 = this.ppu.ChiChiNES$IPPU$VidRAM_GetNTByte(((((((this.ppu.ChiChiNES$IPPU$PatternTableIndex + Bridge.Int.mul(TileIndex, 16)) | 0) + 8) | 0) + patternTableYOffset) | 0));

    //             var attributeByte = this.GetAttributeTableEntry(ppuNameTableMemoryStart, xTilePosition, yTilePosition);

    //             // i want the patternTableEntryIndex'th bit of patternEntry in the 1st bit of pixel
    //             return ((((patternEntry >> patternTableEntryIndex) & 1) | (Bridge.Int.mul(((patternEntryByte2 >> patternTableEntryIndex) & 1), 2)) | attributeByte) & 255);
    //         },
    //         SpriteZeroHit: function (xPosition, yPosition) {
    //             var $t, $t1, $t2, $t3;
    //             var y = ($t = this.ppu.ChiChiNES$IPPU$SpriteRam)[0];
    //             var yLine = yPosition % 8;
    //             var xPos = xPosition % 8;
    //             if (yPosition > y && yPosition <= ((y + 9) | 0)) {
    //                 var tileIndex = ($t1 = this.ppu.ChiChiNES$IPPU$SpriteRam)[1];
    //                 var patternEntry = this.ppu.ChiChiNES$IPPU$VidRAM_GetNTByte(((((((this.ppu.ChiChiNES$IPPU$PatternTableIndex + Bridge.Int.mul(tileIndex, 16)) | 0) + 7) | 0) - yLine) | 0));
    //                 var patternEntryBit2 = this.ppu.ChiChiNES$IPPU$VidRAM_GetNTByte(((((((((this.ppu.ChiChiNES$IPPU$PatternTableIndex + Bridge.Int.mul(tileIndex, 16)) | 0) + 7) | 0) - yLine) | 0) + 8) | 0));

    //                 if (((patternEntry & ($t2 = ChiChiNES.PixelWhizzler.PowersOfTwo)[xPos]) !== 0) || ((patternEntryBit2 & ($t3 = ChiChiNES.PixelWhizzler.PowersOfTwo)[xPos]) !== 0)) {
    //                     return true;
    //                 }
    //             }
    //             return false;
    //         },
    //         DrawSprite: function (spriteNum) {
    //             var $t, $t1, $t2, $t3;
    //             var spriteAddress = Bridge.Int.mul(4, spriteNum);
    //             var y = ($t = this.ppu.ChiChiNES$IPPU$SpriteRam)[spriteAddress];
    //             var attributeByte = ($t1 = this.ppu.ChiChiNES$IPPU$SpriteRam)[((spriteAddress + 2) | 0)];
    //             var x = ($t2 = this.ppu.ChiChiNES$IPPU$SpriteRam)[((spriteAddress + 3) | 0)];
    //             var tileIndex = ($t3 = this.ppu.ChiChiNES$IPPU$SpriteRam)[((spriteAddress + 1) | 0)];

    //             var attrColor = ((attributeByte & 3) << 2) | 16;
    //             var isInFront = (attributeByte & 32) === 32;
    //             var flipX = (attributeByte & 64) === 64;
    //             var flipY = (attributeByte & 128) === 128;

    //             var spritePatternTable = 0;
    //             // if these are 8x16 sprites, read high and low, draw
    //             if ((this.ppu.ChiChiNES$IPPU$PPUControlByte0 & 32) === 32) {
    //                 if ((tileIndex & 1) === 1) {
    //                     spritePatternTable = 4096;
    //                 }
    //                 var getPatternTableEntry = this.GetSprite(spritePatternTable, tileIndex, attrColor, flipX, flipY);
    //                 // spritePatternTable = spritePatternTable ^ 0x1000;
    //                 tileIndex = (tileIndex + 1) | 0;
    //                 var getPatternTableEntryBottom = this.GetSprite(spritePatternTable, tileIndex, attrColor, flipX, flipY);

    //                 if (flipY) {
    //                     this.MergeRect(getPatternTableEntryBottom, 8, 8, ((x - 1) | 0), ((y + 1) | 0), isInFront);
    //                     this.MergeRect(getPatternTableEntry, 8, 8, ((x - 1) | 0), ((y + 9) | 0), isInFront);
    //                 } else {
    //                     this.MergeRect(getPatternTableEntry, 8, 8, ((x - 1) | 0), ((y + 1) | 0), isInFront);
    //                     this.MergeRect(getPatternTableEntryBottom, 8, 8, ((x - 1) | 0), ((y + 9) | 0), isInFront);
    //                 }
    //             } else {
    //                 // 8x8 sprites
    //                 if ((this.ppu.ChiChiNES$IPPU$PPUControlByte0 & 8) === 8) {
    //                     spritePatternTable = 4096;
    //                 }
    //                 var getPatternTableEntry1 = this.GetSprite(spritePatternTable, tileIndex, attrColor, flipX, flipY);

    //                 this.MergeRect(getPatternTableEntry1, 8, 8, ((x - 1) | 0), ((y + 1) | 0), isInFront);
    //             }

    //             return;
    //         },
    //         DrawAllSprites: function () {
    //             for (var i = 63; i >= 0; i = (i - 1) | 0) {

    //                 this.DrawSprite(i);
    //             }
    //         },
    //         /**
    //          * returns a 128x128 buffer for the tiles
    //          *
    //          * @instance
    //          * @public
    //          * @this ChiChiNES.TileDoodler
    //          * @memberof ChiChiNES.TileDoodler
    //          * @param   {number}            PatternTable
    //          * @return  {Array.<number>}
    //          */
    //         DoodlePatternTable: function (PatternTable) {
    //             var $t, $t1;
    //             var patTable = 0;
    //             switch (PatternTable) {
    //                 case 4096: 
    //                     patTable = 1;
    //                     break;
    //                 case 0: 
    //                     patTable = 0;
    //                     break;
    //             }

    //             // return a 16x16 x 64 per tile pattern table for display
    //             var patterns = { v : System.Array.init(16384, 0, System.Int32) };
    //             var tile;
    //             for (var j = 0; j < 16; j = (j + 1) | 0) {
    //                 for (var i = 0; i < 16; i = (i + 1) | 0) {
    //                     tile = this.GetPatternTableEntry(PatternTable, (((i) + Bridge.Int.mul(j, 16)) | 0), 0, Bridge.ref(($t = ($t1 = this.currentPatternTableEntries[patTable])[i]), j));
    //                     this.DrawTile(patterns, 128, 128, tile, Bridge.Int.mul(i, 8), Bridge.Int.mul(j, 8));
    //                 }
    //             }
    //             return patterns.v;
    //         }

    //         /**
    //          * returns a pixel array representing a current nametable in memory
    //          nametable will be 0,0x400, 0x800, 0xC00, mapped to 0x200 + Nametable
    //          *
    //          * @instance
    //          * @public
    //          * @this ChiChiNES.TileDoodler
    //          * @memberof ChiChiNES.TileDoodler
    //          * @param   {number}            NameTable
    //          * @return  {Array.<number>}
    //          */
    DoodleNameTable (NameTable): Int32Array {
        //  a doodle returns an Int32Array containing RGBA values
        const result = new Int32Array(61440);
        //debugger;
        for (let i = 0; i < 32; i = (i + 1) | 0) {
            for (let j = 0; j < 30; j = (j + 1) | 0) {

                const address = ((8192 + NameTable)  + i)  + (j * 32) ;
                const TileIndex = this.ppu.ChrRomHandler.GetPPUByte(0, address);

                const addToCol = this.GetAttributeTableEntry(NameTable, i, j);
                const tile = this.GetPatternTableEntry(this.ppu.PatternTableIndex, TileIndex,
                        addToCol, this.currentNameTableEntries[i][j]);
                this.DrawTile(result, 256, 240, tile, (i * 8), (j * 8));
            }
        }
        return result;
    }

    DrawTile(destBuffer: Int32Array, width: number, height: number, tile: Uint8Array, xPos: number, yPos: number) {
        for (let j = 0; j < 8; j++) {
            for (let i = 0; i < 8; i++) {
                const xPosition = (xPos + 8) - i;
                const yPosition = (yPos + j) * width;
                if (xPos > height) {
                    break;
                }
                if (((yPosition + xPosition) | 0) >= destBuffer.length) {
                    break;
                }
                 destBuffer[yPosition + xPosition] =   tile[(j * 8) + i];
            }
        }
    }

    GetNameTableEntryLocation (x: number, y: number): number {
        return this.currentNameTableEntries[(((x >> 5)) | 0)][(((y / 30)) | 0)][y & 7];
    }

    // GetPatternEntryLocation: function (table, x, y) {
    //     var $t, $t1, $t2;
    //     return ($t = ($t1 = ($t2 = this.currentPatternTableEntries[table])[((Bridge.Int.div(x, 32)) | 0)])[((Bridge.Int.div(y, 30)) | 0)])[y & 7];
    // }
        
    // });

}
