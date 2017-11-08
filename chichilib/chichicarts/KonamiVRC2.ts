import { BaseCart } from "./BaseCart";

export class KonamiVRC2Cart extends BaseCart {
    microwireLatch: number = 0;
    irqCounter: number = 0;
    irqMode: boolean = false;
    irqEnableAfterAck = false;
    irqEnable = false;
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

    advanceClock(clock: number) {
        if (this.irqEnable) {
            this.irqCounter -= clock;
            if (this.irqCounter <= 0) {
                this.CPU._handleIRQ = true;
                this.irqEnable = false;
            }
        }
    }

    ackIrq() {
        this.irqEnable = false;
        if (this.irqEnableAfterAck) {
            this.irqEnable = true;
            this.irqCounter = this.irqMode ? this.irqLatch : (this.irqLatch * 113.66666667) | 0;
        }
    }
    set irqControl(val: number) {
        this.irqEnableAfterAck = (val & 0x1) == 0x1;
        this.irqEnable = (val & 0x2) == 0x2;
        this.irqMode = (val & 0x4) == 0x4;
        if (this.irqEnable) {

            this.irqCounter = this.irqMode ? this.irqLatch : (this.irqLatch * 113.66666667) | 0;
        }
        
    }

    InitializeCart() {
        this.mapperName = 'KonamiVRC2';
        this.SetupBankStarts(0, 0, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        this.CopyBanks4k(0, 0, 0, 2);

        switch (this.ROMHashFunction)
        {
            case 'C1FBF659': // boku dracula kun
            case '91328C1D':  // tiny toon adventures j
            case 'D467C0CC': // parodius da!
            case 'FCBF28B1':
                this.regNums = [
                    0x00,
                    0x04,
                    0x08,
                    0x0c,
                ];
            break;
        }
    }

    GetByte(clock: number, address: number) : number {
        // LDA $6100 and LDA $6000 will return $60|latch
        if (address >= 0x6000 && address <= 0x7FFF ) {
            return (address >> 8) | this.microwireLatch;
        }
        return this.baseGetByte(clock, address);
    }

    SetByte(clock:number, address:number, data: number){
        switch(address & 0xF000) {
        case 0x6000:
            this.microwireLatch = data & 0x1;
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
                    this.Mirror(clock, 1);
                    break;
                case 1: // horizontal
                    this.Mirror(clock, 2);
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
        case 0xF000:
            if ((address & 0xF) == 0x0) {
                this.irqLatch |= (0xF & data);
            } else
            if ((address & 0xF) == 0x1) {
                this.irqLatch |= ((0xF & data) << 4);
            } 
            if ((address & 0xF) == 0x2) {
                this.irqControl = data;
            } 
            if ((address & 0xF) == 0x3) {
                this.ackIrq();
            } 

            break;   
        }
    }
}

export class KonamiVRC022Cart extends BaseCart {
    microwireLatch: number = 0;
    irqCounter: number = 0;
    irqMode: boolean = false;
    irqEnableAfterAck = false;
    irqEnable = false;
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
        0x02,
        0x01,
        0x03,
    ];

    irqLatch: number = 0;

    advanceClock(clock: number) {
        if (this.irqEnable) {
            this.irqCounter -= clock;
            if (this.irqCounter <= 0) {
                this.CPU._handleIRQ = true;
                this.irqEnable = false;
            }
        }
    }

    ackIrq() {
        this.irqEnable = false;
        if (this.irqEnableAfterAck) {
            this.irqEnable = true;
            this.irqCounter = this.irqMode ? this.irqLatch : (this.irqLatch * 113.66666667) | 0;
        }
    }
    set irqControl(val: number) {
        this.irqEnableAfterAck = (val & 0x1) == 0x1;
        this.irqEnable = (val & 0x2) == 0x2;
        this.irqMode = (val & 0x4) == 0x4;
        if (this.irqEnable) {

            this.irqCounter = this.irqMode ? this.irqLatch : (this.irqLatch * 113.66666667) | 0;
        }
        
    }

    InitializeCart() {
        this.mapperName = 'KonamiVRC2a';
        this.SetupBankStarts(0, 0, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        this.CopyBanks4k(0, 0, 0, 2);
    }

    SetByte(clock:number, address:number, data: number){
        switch(address & 0xF000) {
        case 0x6000:
            this.microwireLatch = data & 0x1;
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
                    this.Mirror(clock, 1);
                    break;
                case 1: // horizontal
                    this.Mirror(clock, 2);
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
            this.CopyBanks1k(clock, 0, (this.chrbank0 | this.chrbank0_1) >> 1, 1);
            this.CopyBanks1k(clock, 1, (this.chrbank1 | this.chrbank1_1) >> 1, 1);
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
            this.CopyBanks1k(clock, 2, (this.chrbankc0 | this.chrbankc0_1) >> 1, 1);
            this.CopyBanks1k(clock, 3, (this.chrbankc1 | this.chrbankc1_1) >> 1, 1);
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
            this.CopyBanks1k(clock, 4, (this.chrbankd0 | this.chrbankd0_1) >> 1, 1);
            this.CopyBanks1k(clock, 5, (this.chrbankd1 | this.chrbankd1_1) >> 1, 1);
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
            this.CopyBanks1k(clock, 6, (this.chrbanke0 | this.chrbanke0_1) >> 1, 1);
            this.CopyBanks1k(clock, 7, (this.chrbanke1 | this.chrbanke1_1) >> 1, 1);
            break;         
        case 0xF000:
            if ((address & 0xF) == 0x0) {
                this.irqLatch |= (0xF & data);
            } else
            if ((address & 0xF) == 0x1) {
                this.irqLatch |= ((0xF & data) << 4);
            } 
            if ((address & 0xF) == 0x2) {
                this.irqControl = data;
            } 
            if ((address & 0xF) == 0x3) {
                this.ackIrq();
            } 

            break;   
        }
    }
}


export class Konami021Cart extends BaseCart {
    swapMode: boolean = false;
    microwireLatch: number = 0;
    irqCounter: number = 0;
    irqMode: boolean = false;
    irqEnableAfterAck = false;
    irqEnable = false;
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
        0x02,
        0x04,
        0x06,
    ];


    irqLatch: number = 0;

    advanceClock(clock: number) {
        if (this.irqEnable) {
            this.irqCounter -= clock;
            if (this.irqCounter <= 0) {
                this.CPU._handleIRQ = true;
                this.irqEnable = false;
            }
        }
    }

    ackIrq() {
        this.irqEnable = false;
        if (this.irqEnableAfterAck) {
            this.irqEnable = true;
            this.irqCounter = this.irqMode ? this.irqLatch : (this.irqLatch * 113.66666667) | 0;
        }
    }
    set irqControl(val: number) {
        this.irqEnableAfterAck = (val & 0x1) == 0x1;
        this.irqEnable = (val & 0x2) == 0x2;
        this.irqMode = (val & 0x4) == 0x4;
        if (this.irqEnable) {

            this.irqCounter = this.irqMode ? this.irqLatch : (this.irqLatch * 113.66666667) | 0;
        }
        
    }

    InitializeCart() {
        this.mapperName = 'KonamiVRC2';
        this.SetupBankStarts(0, 0, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        this.CopyBanks4k(0, 0, 0, 2);

        switch (this.ROMHashFunction)
        {
            case '286FCD20': // ganbare goemon gaiden 2
                this.regNums = [
                    0x000,
                    0x040,
                    0x080,
                    0x0c0,
                ];
            break;
        }
    }

    SetByte(clock:number, address:number, data: number){
        switch(address & 0xF000) {

        case 0x8000:
            // 8kib prg rom at 8000
            let bank8 = data & 0x1F;
            if (this.swapMode) {
                this.SetupBankStarts(this.prgRomCount * 2 - 2, this.currentA, bank8, this.currentE);
            } else {
                this.SetupBankStarts(bank8, this.currentA, this.prgRomCount * 2 - 2, this.currentE);
            }
            break;
        case 0xA000:
            // 8kib prg rom at A000
            let bankA = data & 0x1F;
            this.SetupBankStarts(this.current8, bankA, this.currentC, this.currentE);
            break;
        case 0x9000:
            if (address <= 0x9001 )
            {
                switch (data & 7) {
                case 0: // vertical
                    this.Mirror(clock, 1);
                    break;
                case 1: // horizontal
                    this.Mirror(clock, 2);
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

            if (address == 0x9002 || address == 0x9003) {
                this.swapMode = (data & 2) == 2; 
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
        case 0xF000:
            if ((address & 0xF) == 0x0) {
                this.irqLatch |= (0xF & data);
            } else
            if ((address & 0xF) == 0x1) {
                this.irqLatch |= ((0xF & data) << 4);
            } 
            if ((address & 0xF) == 0x2) {
                this.irqControl = data;
            } 
            if ((address & 0xF) == 0x3) {
                this.ackIrq();
            } 

            break;   
        }
    }
}

export class Konami025Cart extends BaseCart {
    swapMode: boolean = false;
    microwireLatch: number = 0;
    irqCounter: number = 0;
    irqMode: boolean = false;
    irqEnableAfterAck = false;
    irqEnable = false;
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
        0x000, 0x002, 0x001, 0x003
    ];


    irqLatch: number = 0;

    advanceClock(clock: number) {
        if (this.irqEnable) {
            this.irqCounter -= clock;
            if (this.irqCounter <= 0) {
                this.CPU._handleIRQ = true;
                this.irqEnable = false;
            }
        }
    }

    ackIrq() {
        this.irqEnable = false;
        if (this.irqEnableAfterAck) {
            this.irqEnable = true;
            this.irqCounter = this.irqMode ? this.irqLatch : (this.irqLatch * 113.66666667) | 0;
        }
    }
    set irqControl(val: number) {
        this.irqEnableAfterAck = (val & 0x1) == 0x1;
        this.irqEnable = (val & 0x2) == 0x2;
        this.irqMode = (val & 0x4) == 0x4;
        if (this.irqEnable) {

            this.irqCounter = this.irqMode ? this.irqLatch : (this.irqLatch * 113.66666667) | 0;
        }
        
    }

    InitializeCart() {
        this.mapperName = 'KonamiVRC2';
        this.SetupBankStarts(0, 0, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        this.CopyBanks4k(0, 0, 0, 2);

        switch (this.ROMHashFunction)
        {
            case '4A601A2C': // teenage mutant ninja turtles j
                this.regNums = [
                    0x000, 0x008, 0x004, 0x00C
                ];
            break;
        }
    }

    SetByte(clock:number, address:number, data: number){
        switch(address & 0xF000) {

        case 0x8000:
            // 8kib prg rom at 8000
            let bank8 = data & 0x1F;
            if (this.swapMode) {
                this.SetupBankStarts(this.prgRomCount * 2 - 2, this.currentA, bank8, this.currentE);
            } else {
                this.SetupBankStarts(bank8, this.currentA, this.prgRomCount * 2 - 2, this.currentE);
            }
            break;
        case 0xA000:
            // 8kib prg rom at A000
            let bankA = data & 0x1F;
            this.SetupBankStarts(this.current8, bankA, this.currentC, this.currentE);
            break;
        case 0x9000:
            if (address <= 0x9001 )
            {
                switch (data & 7) {
                case 0: // vertical
                    this.Mirror(clock, 1);
                    break;
                case 1: // horizontal
                    this.Mirror(clock, 2);
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

            if (address == 0x9002 || address == 0x9003) {
                this.swapMode = (data & 2) == 2; 
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
        case 0xF000:
            if ((address & 0xF) == 0x0) {
                this.irqLatch |= (0xF & data);
            } else
            if ((address & 0xF) == 0x1) {
                this.irqLatch |= ((0xF & data) << 4);
            } 
            if ((address & 0xF) == 0x2) {
                this.irqControl = data;
            } 
            if ((address & 0xF) == 0x3) {
                this.ackIrq();
            } 

            break;   
        }
    }
}
