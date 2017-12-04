import * as crc from 'crc';

export class NESFileDecoder {
    rom: Uint8Array;
    magicNumber: Uint8Array;
    chrRom: Uint8Array;
    prgRom: Uint8Array;

    private ramCountArray: Uint8Array;
    private romCountArray: Uint8Array;
    private mapperBytes: Uint8Array;
    private _buffer: ArrayBuffer;

    constructor (buffer = new ArrayBuffer(16)) {
        this._buffer = buffer;
        this.rom = new Uint8Array(this._buffer, 16, this._buffer.byteLength - 16);
        this.magicNumber = new Uint8Array(this._buffer,0, 3);
        // [78, 69, 83]
        this.romCountArray = new Uint8Array(this._buffer, 4, 2);
        this.mapperBytes = new Uint8Array(this._buffer, 6, 3);

        this.ramCountArray = new Uint8Array(this._buffer, 10, 2); 
        this.prgRom = new Uint8Array(this._buffer, 16, this.prgRomLength);
        this.chrRom = new Uint8Array(this._buffer, 16 + this.prgRomLength, this.chrRomLength);

    }

    get romCRC(): string{
        return crc.crc32(new Buffer(this.rom)).toString(16).toUpperCase();
    }
    
    get mapperId(): number { 
        const maps =this.mapperBytes;
        let id = (maps[0] & 240);
        id = id >> 4;
        id = id | (maps[1] & 0xf0);
        id |= (maps[2] & 0xF) << 8;
        return id;
    }

    get submapperId(): number {
        return this.mapperBytes[2] >> 4;
    }

    get prgRomCount(): number {
        return this.romCountArray[0];
    }

    get prgRomLength(): number {
        return this.prgRomCount * 0x4000;
    }

    get chrRomCount(): number {
        return this.romCountArray[1];
    }

    get chrRomLength(): number {
        return this.chrRomCount * 0x2000;
    }

    get prgRamBanks(): number {
        return this.ramCountArray[0] & 0xf;
    }

    get prgRamBanksBatteryBacked(): number {
        return (this.ramCountArray[0] >> 4) & 0xf;
    } 

    get chrRamBanks(): number {
        return this.ramCountArray[1] & 0xf;
    }

    get chrRamBanksBatteryBacked(): number {
        return (this.ramCountArray[1] >> 4) & 0xf;
    }

    get isPC10(): boolean {
        return (this.mapperBytes[1] & 0x2) == 0x02;
    }

    get isVS(): boolean {
        return (this.mapperBytes[1] & 0x1) == 0x01;
    }

    get usesSRAM() : boolean { 
        return (this.mapperBytes[0] & 2) === 2; 
    }
    
    get batterySRAM() : boolean { 
        return (this.mapperBytes[0] & 2) === 2; 
    }

    get mirroring(): number {

        if ((this.mapperBytes[0] & 8) === 8) {
            return 3;
        }

        if ((this.mapperBytes[0] & 1) === 1) {
            return 1;
        } else {
            return 2;
        }
    }

    get fourScreen(): boolean {
        return (this.mapperBytes[0] & 8) === 8; 
    }

}