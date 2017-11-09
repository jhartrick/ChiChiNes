import { BaseCart } from "./BaseCart";

interface PokeMap {
    id?: number;
    mask: number;
    address: number[];
    func:  (clock: number, address: number, data: number) => void;
}

// this base class contains the common irq functionality for a whole bunch of konami vrc mappers use
class VRCIrqCart extends BaseCart {
    vrc2: boolean = false;
    swapMode: boolean = false;
    microwireLatch: number = 0;
    irqLatch: number = 0;
    prescaler = 341;
    irqCounter: number = 0;
    irqMode: boolean = false;
    irqEnableAfterAck = false;
    irqEnable = false;

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

    vrc2mirroring = (clock, address, data) => {
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
    }

    vrc4mirroring = (clock: number, address: number, data: number) => {
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
    }

    vrcmirroring = this.vrc4mirroring;
    writeMap:PokeMap[] = [
        {
            mask: 0xF000, address: [0x8000], 
            func: (clock, address, data) => {
                let bank8 = data & 0x1F;
                if (this.swapMode) {
                    this.SetupBankStarts(this.prgRomCount * 2 - 2, this.currentA, bank8, this.currentE);
                } else {
                    this.SetupBankStarts(bank8, this.currentA, this.prgRomCount * 2 - 2, this.currentE);
                }                
            }
        },
        {
            mask: 0xF000, address: [0xA000], 
            func: (clock, address, data) => {
                // 8kib prg rom at A000
                let bankA = data & 0x1F;
                this.SetupBankStarts(this.current8, bankA, this.currentC, this.currentE);
            }
        },
        {
            mask: 0xF000, address: [0x9000], 
            func: (clock, address, data) => {
                this.vrcmirroring(clock, address, data);
            }
        },
        {
            // irq handlers
            mask: 0xF000, address: [0xF000],
            func: (clock, address, data) => {
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
            }
        },
        {
            // memory handlers, registerlocations change
            mask: 0xF000, address: [0xb000, 0xc000, 0xd000, 0xe000],
            func: (clock, address, data) => {
                
                const bank = ((address >> 12) & 0xf) - 0xb;
                const index = bank * 4;
                if ((address & 0xFFF) == this.regNums[0]) {
                    this.latches[index]  = data & 0xF;
                } else if ((address & 0xFFF) == this.regNums[1]) {
                    this.latches[index + 1] = (data & 0xf) << 4;
                } else if ((address & 0xFFF) == this.regNums[2]) {
                    this.latches[index + 2]  = data & 0xF;
                } else if ((address & 0xFFF) == this.regNums[3]) {
                    this.latches[index + 3] = (data & 0xf) <<4;
                }
                this.vrcCopyBanks1k(clock, (bank * 2) + 0, this.latches[index] | this.latches[index + 1], 1);
                this.vrcCopyBanks1k(clock, (bank * 2) + 1, this.latches[index + 2] | this.latches[index + 3], 1);
        }
    }];

    vrcCopyBanks1k(clock: number, dest: number, src: number, numberOf1kBanks: number): void {
        this.CopyBanks1k(clock, dest, src, numberOf1kBanks);
    }
    
    useMicrowire () {
        this.GetByte = this.getByteMicrowire;
        
        this.writeMap.push(
            {
                mask: 0xF000,
                address: [0x6000], 
                func: (clock, address, data) => {
                this.microwireLatch = data & 0x1;
            }
        });
    }  
    
    getByteMicrowire(clock: number, address: number) : number {
        // LDA $6100 and LDA $6000 will return $60|latch
        if (address >= 0x6000 && address <= 0x7FFF ) {
            return (address >> 8) | this.microwireLatch;
        }
        return this.baseGetByte(clock, address);
    }

    tickIrq() {
        
        this.irqCounter++;
        if (this.irqCounter == 0xFF) {
            console.log('irq')
            this.prescaler = 341;
            this.irqCounter = this.irqLatch;

            this.CPU._handleIRQ = true;
        }
    }

    tick(ticks: number) {
        if (this.irqMode) {
            for(let i =0; i < ticks;++i) {
                this.tickIrq();
            }

        } else {
            this.prescaler -= ticks * 3;
            if (this.prescaler <= 0) {
                this.tickIrq();
                this.prescaler+=341;
            }
        }
    }

    advanceClock(clock: number) {
        if (this.irqEnable) {
            this.tick(clock);
        }
    }

    ackIrq() {
        console.log('ack irq')
        this.irqEnable = this.irqEnableAfterAck;
    }

    set irqControl(val: number) {
        console.log('irqControl ' + val)
        this.irqEnableAfterAck = (val & 0x1) == 0x1;
        this.irqEnable = (val & 0x2) == 0x2;
        this.irqMode = (val & 0x4) == 0x4;
        if (this.irqEnable) {
            this.prescaler = 341;
            this.irqCounter =this.irqLatch ;
        }
    }

    SetByte(clock:number, address:number, data: number) {
        const map = this.writeMap;
        for (let i =0;i < map.length; ++i) {
            const x = map[i].mask & address;
            if (map[i].address.find( (v) => {
                return v ==  x; 
            })) {
                map[i].func(clock, address,data);
                return;
            }
        }
    }

}

export class KonamiVRC2Cart extends VRCIrqCart {

    altRegNums (){
        this.regNums = [
            0x00,
            0x04,
            0x08,
            0x0c,
        ];
    }

    InitializeCart() {
        this.mapperName = 'KonamiVRC2';
        this.SetupBankStarts(0, 0, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        this.CopyBanks4k(0, 0, 0, 2);

        switch (this.ROMHashFunction)
        {
            case 'CC9FFEC': // ganbare goemon 2 
            case 'B27B8CF4': // Gryzor (contra j)
                this.useMicrowire();
                break;
            case 'D467C0CC': // parodius da!
                this.useMicrowire();
                this.altRegNums();
                break;
            case 'C1FBF659': // boku dracula kun
            case '91328C1D':  // tiny toon adventures j
            case 'FCBF28B1':
                this.altRegNums();
                break;
        }
    }

}

export class KonamiVRC022Cart extends VRCIrqCart {
    InitializeCart() {
        this.mapperName = 'KonamiVRC2a';
        this.SetupBankStarts(0, 0, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        this.CopyBanks4k(0, 0, 0, 2);
        this.regNums = [
            0x0,
            0x2,
            0x1,
            0x3,
        ];
        this.vrcmirroring = this.vrc2mirroring;
        this.vrcCopyBanks1k = (clock, dest,src, numberOf1kBanks) => {
            this.CopyBanks1k(clock, dest, src >> 1, numberOf1kBanks);
        }

        //this.useMicrowire();
        switch (this.ROMHashFunction) {
            case 'D4645E14':
                this.Mirror(0,2);
                break;
        }
    }

}

export class Konami021Cart extends VRCIrqCart {

    InitializeCart() {
        this.mapperName = 'KonamiVRC2';
        this.SetupBankStarts(0, 0, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        this.CopyBanks4k(0, 0, 0, 2);
        this.regNums = [
            0x00,
            0x02,
            0x04,
            0x06,
        ];
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
}

export class Konami025Cart extends VRCIrqCart {

    InitializeCart() {
        this.mapperName = 'KonamiVRC4';
        this.SetupBankStarts(0, 0, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        this.CopyBanks4k(0, 0, 0, 2);
        this.regNums = [0x000, 0x002, 0x001, 0x003];
        switch (this.ROMHashFunction)
        {
            case '490E8A4C':
                this.useMicrowire();
            case '4A601A2C': // teenage mutant ninja turtles j
                this.regNums = [
                    0x000, 0x008, 0x004, 0x00C
                ];
            break;
        }
    }

}
