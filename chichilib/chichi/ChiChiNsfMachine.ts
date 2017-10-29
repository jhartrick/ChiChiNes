import { ChiChiCPPU, ChiChiMachine } from "./ChiChiMachine";
import { ChiChiPPU } from "./ChiChiPPU";

export class ChiChiNsfMachine extends ChiChiMachine
{

    Cpu: ChiChiNsfCPPU;
    ppu: ChiChiPPU;
    constructor() {
        super();
        this.ppu = new ChiChiPPU();
        this.Cpu = new ChiChiNsfCPPU(this.SoundBopper, this.ppu);
        this.Cpu.ppu = this.ppu;
        this.Cpu.frameFinished = () => { this.FrameFinished(); };
    }

    LoadNsf(rom: number[]) {
        this.Cpu.LoadNsf(rom);
    }
}

export class ChiChiNsfCPPU extends ChiChiCPPU
{


    copyright: string;
    artist: string;
    songName: string;
    runNsfAt: number = 0;
    loadNsfAt: number = 0;
    initNsfAt: number = 0;
    firstSong: number = 0;
    songCount: number = 0;

    __SetByte(address: number, data: number) {
        var bank = 0;
        this.Rams[address] = data;
    }

    GetByte(address: number) : number {
        return this.Rams[address];
    }

    LoadNsf(nsfFile: number[]): void {
        const header = nsfFile.slice(0, 16);

        const ramsBuffer = new SharedArrayBuffer(0x10000 * Uint8Array.BYTES_PER_ELEMENT);
        this.Rams = new Uint8Array(<any>ramsBuffer);// System.Array.init(vv, 0, System.Int32);
        this.Rams.fill(0);
        //        $000    5   STRING  'N', 'E', 'S', 'M', $1A(denotes an NES sound format file)
        //        $005    1   BYTE    Version number (currently $01)
        //        $006    1   BYTE    Total songs   (1 = 1 song, 2 = 2 songs, etc)
        //        $007    1   BYTE    Starting song (1 = 1st song, 2 = 2nd song, etc)
        //        $008    2   WORD    (lo, hi) load address of data ($8000 - FFFF)
        //        $00A    2   WORD    (lo, hi) init address of data ($8000 - FFFF)
        //        $00C    2   WORD    (lo, hi) play address of data ($8000 - FFFF)
        //        $00E    32  STRING  The name of the song, null terminated
        //        $02E    32  STRING  The artist, if known, null terminated
        //        $04E    32  STRING  The copyright holder, null terminated
        //        $06E    2   WORD    (lo, hi) Play speed, in 1 / 1000000th sec ticks, NTSC(see text)
        //        $070    8   BYTE    Bankswitch init values (see text, and FDS section)
        //        $078    2   WORD    (lo, hi) Play speed, in 1 / 1000000th sec ticks, PAL(see text)
        //        $07A    1   BYTE    PAL/ NTSC bits
        //        bit 0: if clear, this is an NTSC tune
        //        bit 0: if set, this is a PAL tune
        //        bit 1: if set, this is a dual PAL/ NTSC tune
        //        bits 2- 7: not used.they * must * be 0
        //        $07B    1   BYTE    Extra Sound Chip Support
        //        bit 0: if set, this song uses VRC6 audio
        //        bit 1: if set, this song uses VRC7 audio
        //        bit 2: if set, this song uses FDS audio
        //        bit 3: if set, this song uses MMC5 audio
        //        bit 4: if set, this song uses Namco 163 audio
        //        bit 5: if set, this song uses Sunsoft 5B audio
        //        bits 6, 7: future expansion: they * must * be 0
        //        $07C    1   BYTE    Extra Sound Chip Support (Cont.)
        //        bits 0- 3: future expansion: they * must * be 0
        //        bits 4- 7: unavailable(conflicts with NSF2 backwards compatibility)
        //        $07D    3   ----    3 extra bytes for expansion (must be $00)
        //        $080    nnn ----    The music program/ data follows until end of file

        this.songCount = header[0x06];
        this.firstSong = header[0x07];

        this.loadNsfAt = (header[0x09] << 8) + header[0x08];
        this.initNsfAt = (header[0x0B] << 8) + header[0x0A];
        this.runNsfAt = (header[0x0D] << 8) + header[0x0C];


        this.songName = header.slice(0x0E, 0x0e + 32).map((v) => { return String.fromCharCode(v); }).join('').trim();
        this.artist = header.slice(0x02E, 0x0e + 32).map((v) => { return String.fromCharCode(v); }).join('').trim();
        this.copyright = header.slice(0x4E, 0x0e + 32).map((v) => { return String.fromCharCode(v); }).join('').trim();

        let address = this.loadNsfAt;
        nsfFile = nsfFile.slice(16, nsfFile.length);
        for (let i = 0; i < nsfFile.length - 0x80; ++i) {
            this.__SetByte(address + i, nsfFile[0x80 + i]);
        }
        this.InitNsf();
    }

    InitNsf() {
        this.SetByte(0x4017, 0x40);
        this._accumulator = this.firstSong;
        this._indexRegisterX = 0;
        this._programCounter = this.initNsfAt;
        debugger;
        while (this._programCounter != this.runNsfAt) {
            this.Step();
        }
        console.log("ready to play");

    }
}