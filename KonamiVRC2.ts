import { BaseCart } from "./BaseCart";

export class KonamiVRC2Cart extends BaseCart {
    chrbank0 = 0;
    chrbank0_1  = 0;
    chrbank1 = 0;
    chrbank1_1 = 0;
    chrbankc1_1: number = 0;
    chrbankc1: number = 0;
    chrbankc0_1: number = 0;
    chrbankc0: number = 0;
    chrbankd1_1: number = 0;
    chrbankd1: number = 0;
    chrbankd0_1: number = 0;
    chrbankd0: number = 0;
    chrbanke1_1: number = 0;
    chrbanke1: number = 0;
    chrbanke0_1: number = 0;
    chrbanke0: number = 0;

    latches:number[] =[
        0,0,
        0,0,
        0,0,
        0,0,
        0,0,
        0,0,
        0,0,
        0,0,
        ] ;
    
    regNums = [
        0x00,
        0x01,
        0x02,
        0x03,
    ];

    irqLatch: number = 0;

    InitializeCart() {
        this.mapperName = 'KonamiVRC2';
        this.SetupBankStarts(0, 0, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        this.CopyBanks4k(0, 0, 0, 2);

        switch (this.ROMHashFunction)
        {
            case 'C1FBF659': // boku dracula kun
            case '91328C1D':  // tiny toon adventures j
                this.regNums = [
                    0x00,
                    0x04,
                    0x08,
                    0x0c,
                ];
            break;
        }
    }

    SetByte(clock:number, address:number, data: number){
        switch(address & 0xF000) {
        case 0x6000:
            break;
        case 0x8000:
            // 8kib prg rom at 8000
            let bank8 = data & 0x1F;
            this.SetupBankStarts(bank8, this.currentA, this.currentC, this.currentE);
            break;
        case 0xA000:
            // 8kib prg rom at A000
            let bankA = data & 0x1F;
            this.SetupBankStarts(this.current8, bankA, this.currentC, this.currentE);
            break;
        case 0x9000:
            if (address <= 0x9003 )
            {
                switch (data & 7) {
                case 0: // vertical
                    this.Mirror(clock, 2);
                    break;
                case 1: // horizontal
                    this.Mirror(clock, 1);
                    break;
                case 2: // onescreen - low
                    this.oneScreenOffset= 0;
                    this.Mirror(clock, 0);
                    break;
                case 3: // onescreen - high
                    this.oneScreenOffset= 0x400;
                    this.Mirror(clock, 0);
                    break;
                }
            }
            // this.CopyBanks4k(clock, 0, this.chrbank0 , 1);
            // this.CopyBanks4k(clock, 1, this.chrbank1 , 1);
            break;
        case 0xB000:
            if ((address & 0xFFF) == this.regNums[0]) {
                this.chrbank0 = data & 0xF;
            } 
            if ((address & 0xFFF) == this.regNums[1]) {
                this.chrbank0_1 = (data & 0xf) << 4;
            }
            if ((address & 0xFFF) == this.regNums[2]) {
                this.chrbank1 = data & 0xF;
            } 
            if ((address & 0xFFF) == this.regNums[3]) {
                this.chrbank1_1 = (data & 0xf) <<4;
            }
            this.CopyBanks1k(clock, 0, this.chrbank0 | this.chrbank0_1, 1);
            this.CopyBanks1k(clock, 1, this.chrbank1 | this.chrbank1_1, 1);
            break;
            
        case 0xc000:
            if ((address & 0xFFF) == this.regNums[0]) {
            this.chrbankc0 = data & 0xF;
            } 
            if ((address & 0xFFF) == this.regNums[1]) {
                this.chrbankc0_1 = (data & 0xf) << 4;
            }
            if ((address & 0xFFF) == this.regNums[2]) {
                this.chrbankc1 = data & 0xF;
            } 
            if ((address & 0xFFF) == this.regNums[3]) {
                this.chrbankc1_1 = (data & 0xf) <<4;
            }
            this.CopyBanks1k(clock, 2, this.chrbankc0 | this.chrbankc0_1, 1);
            this.CopyBanks1k(clock, 3, this.chrbankc1 | this.chrbankc1_1, 1);
            break;
        case 0xd000:
            if ((address & 0xFFF) == this.regNums[0]) {
            this.chrbankd0 = data & 0xF;
            } 
            if ((address & 0xFFF) == this.regNums[1]) {
                this.chrbankd0_1 = (data & 0xf) << 4;
            }
            if ((address & 0xFFF) == this.regNums[2]) {
                this.chrbankd1 = data & 0xF;
            } 
            if ((address & 0xFFF) == this.regNums[3]) {
                this.chrbankd1_1 = (data & 0xf) <<4;
            }
            this.CopyBanks1k(clock, 4, this.chrbankd0 | this.chrbankd0_1, 1);
            this.CopyBanks1k(clock, 5, this.chrbankd1 | this.chrbankd1_1, 1);
            break;
        case 0xe000:
            if ((address & 0xFFF) == this.regNums[0]) {
                this.chrbanke0 = data & 0xF;
            } 
            if ((address & 0xFFF) == this.regNums[1]) {
                this.chrbanke0_1 = (data & 0xf) << 4;
            }
            if ((address & 0xFFF) == this.regNums[2]) {
                this.chrbanke1 = data & 0xF;
            } 
            if ((address & 0xFFF) == this.regNums[3]) {
                this.chrbanke1_1 = (data & 0xf) <<4;
            }
            this.CopyBanks1k(clock, 6, this.chrbanke0 | this.chrbanke0_1, 1);
            this.CopyBanks1k(clock, 7, this.chrbanke1 | this.chrbanke1_1, 1);
            break;         
            
        }
    }
}