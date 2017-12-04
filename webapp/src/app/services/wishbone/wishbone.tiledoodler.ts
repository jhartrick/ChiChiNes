import { ChiChiCPPU } from 'chichi';
import { WishbonePPU } from './wishbone';

export class TileDoodler {
    static powersOfTwo = [1, 2, 4, 8, 6, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192];
    currentNameTableEntries: Array<Array<Uint8Array>> = null;
    currentPatternTableEntries: Array<Array<Array<Uint8Array>>> = null;
    XOffset = 0;
    YOffset = 0;

    constructor(private ppu: WishbonePPU) {
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

    getPatternTableEntry (PatternTable: number, TileIndex: number, attributeByte: number, actualAddress: any): Uint8Array {
        // 8x8 tile
        const result = new Uint8Array(64); // System.Array.init(64, 0, System.Int32);
        result.fill(0);

        // actualAddress = new Uint8Array(8); // 8, 0, System.Int32);
        // actualAddress.fill(0);

        for (let  i = 0; i < 8; i++) {
            const entryLoc = (PatternTable + (TileIndex << 4))  + i;
            const patternEntry = this.ppu.memoryMap.getPPUByte(0, entryLoc);

            actualAddress[i] = this.ppu.memoryMap.getPPUByte(0, entryLoc);

            const patternEntryBit2 = this.ppu.memoryMap.getPPUByte(0, entryLoc + 8);

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

    getSprite (spriteNumber: number): Uint8Array {
        // 8x8 tile
        const result = new Uint8Array(64);// System.Array.init(64, 0, System.Int32);
        const  yMultiplyer = 8;
        const ppu = this.ppu;
        const patternTable = ppu.SpritePatternTableIndex;
        const sprite = ppu.unpackedSprites[spriteNumber];
        
        for (let i = 0; i < 8; i++) {
            let patternEntry = 0;
            let patternEntryBit2 = 0;
            if (sprite.FlipY) {
                patternEntry = ppu.memoryMap.getPPUByte(0, ((patternTable + (sprite.TileIndex * 16)) + 7) - i );
                patternEntryBit2 = ppu.memoryMap.getPPUByte(0, (((patternTable + (sprite.TileIndex * 16)) + 7) - i) + 8);
            } else {
                patternEntry = ppu.memoryMap.getPPUByte(0, (patternTable + (sprite.TileIndex * 16)) + i);
                patternEntryBit2 = ppu.memoryMap.getPPUByte(0, ((patternTable + (sprite.TileIndex * 16)) + i) + 8);
            }
            if (sprite.FlipX) {
                for (let bit = 7; bit >= 0; bit-- ) {
                    if ((patternEntry & TileDoodler.powersOfTwo[bit]) !== 0) {
                        result[(((i * yMultiplyer) + 7)  - bit)] = 1 | sprite.AttributeByte;
                    }
                    if ((patternEntryBit2 & TileDoodler.powersOfTwo[bit]) !== 0) {
                        const rPos = (((i * yMultiplyer) + 7)  - bit);
                        result[rPos] = result[rPos] | (2 | sprite.AttributeByte);
                    }
                }
            } else {
                for (let bit1 = 0; bit1 < 8; bit1++) {
                    if ((patternEntry & TileDoodler.powersOfTwo[bit1]) !== 0) {
                        result[((((i * 8)) + bit1) | 0)] = 1 | sprite.AttributeByte;
                    }
                    if ((patternEntryBit2 & TileDoodler.powersOfTwo[bit1]) !== 0) {
                        const pos = (i * 8) + bit1;
                        result[pos] = result[pos] | (2 | sprite.AttributeByte);
                    }
                }
            }
        }
        return result;
    }

    getAttributeTableEntry (ppuNameTableMemoryStart: number, i: number, j: number) : number {
        
        const LookUp = this.ppu.memoryMap.getPPUByte(0,(8192 + ppuNameTableMemoryStart)  + 960) + (i >> 2) + ((j >> 2) * 8);

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

    doodlePatternTable (patternTable: number): Int32Array {
        let patTable = 0;
        switch (patternTable) {
            case 4096:
                patTable = 1;
                break;
            case 0:
                patTable = 0;
                break;
        }

        // return a 16x16 x 64 per tile pattern table for display
        const patterns =  new Int32Array(16 * 16 * 64); //  { v : System.Array.init(16384, 0, System.Int32) };
        let tile: Uint8Array;
        for (let j = 0; j < 16; j = (j + 1) | 0) {
            for (let i = 0; i < 16; i = (i + 1) | 0) {
                tile = this.getPatternTableEntry(patternTable, (i + (j * 16)), 0, this.currentPatternTableEntries[patTable][i][j]);
                this.drawTile(patterns, 128, 128, tile, (i * 8), (j * 8));
            }
        }
        return patterns;
    }

    doodleNameTable (NameTable): Int32Array {
        //  a doodle returns an Int32Array containing RGBA values
        const result = new Int32Array(61440);
        // debugger;
        for (let i = 0; i < 32; i = (i + 1) | 0) {
            for (let j = 0; j < 30; j = (j + 1) | 0) {

                const address = ((8192 + NameTable)  + i)  + (j * 32) ;
                const TileIndex = this.ppu.memoryMap.getPPUByte(0, address);

                const addToCol = this.getAttributeTableEntry(NameTable, i, j);
                const tile = this.getPatternTableEntry(this.ppu.PatternTableIndex, TileIndex,
                        addToCol, this.currentNameTableEntries[i][j]);
                this.drawTile(result, 256, 240, tile, (i * 8), (j * 8));
            }
        }
        return result;
    }

    drawTile(destBuffer: Int32Array, width: number, height: number, tile: Uint8Array, xPos: number, yPos: number) {
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

    getNameTableEntryLocation (x: number, y: number): number {
        return this.currentNameTableEntries[(((x >> 5)) | 0)][(((y / 30)) | 0)][y & 7];
    }

}
