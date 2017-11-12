import { BaseCart } from "./BaseCart";

interface PokeMap {
    id?: number;
    mask: number;
    address: number[];
    func:  (clock: number, address: number, data: number) => void;
}

export class VRCIrqBase extends BaseCart {
    irqLatch: number = 0;

    prescaler = 341;
    irqCounter: number = 0;
    irqMode: boolean = false;
    irqEnableAfterAck = false;
    irqEnable = false;


    tickIrq() {
        
        if (this.irqCounter == 0xff) {
            this.prescaler = 341;
            this.irqCounter = this.irqLatch & 0xff;
            this.irqRaised = true;
            //this.CPU._handleIRQ = true;
        } else {
            this.irqCounter++;
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
        this.irqRaised = false;
       
        this.irqEnable = this.irqEnableAfterAck;
    }

    set irqControl(val: number) {
        let oldEnable = this.irqEnable;
        this.irqEnableAfterAck = (val & 0x1) == 0x1;
        this.irqEnable = (val & 0x2) == 0x2;
        this.irqMode = (val & 0x4) == 0x4;
        if (this.irqEnable && !oldEnable) {
            this.prescaler = 341;
            this.irqCounter = this.irqLatch & 0xff;
        }
    }

}

// this base class contains the common irq functionality for a whole bunch of konami vrc mappers use
class VRC2or4Cart extends VRCIrqBase {
    microwire: boolean = false;
    vrc2: boolean = false;
    swapMode: boolean = false;
    microwireLatch: number = 0;
    irqlatches = [0,0];

    latches:number[] =[
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
        ] ;
    
    regNums = [
        0x00,
        0x01,
        0x02,
        0x03,
    ];
    regMask = 0xf;

    ramMask = 0xfff;

    vrc2mirroring = (clock: number, address: number, data: number) => {
        if (address <= 0x9003 )
        {
            switch (data & 1) {
            case 0: // vertical
                this.mirror(clock, 1);
                break;
            case 1: // horizontal
                this.mirror(clock, 2);
                break;
            }
        }
    }

    vrc4mirroring = (clock: number, address: number, data: number) => {
        if (address <= 0x9001 )
        {
            switch (data & 7) {
            case 0: // vertical
                this.mirror(clock, 1);
                break;
            case 1: // horizontal
                this.mirror(clock, 2);
                break;
            case 2: // onescreen - low
                this.oneScreenOffset= 0x0400;
                this.mirror(clock, 0);
                break;
            case 3: // onescreen - high
                this.oneScreenOffset = 0x0;
                this.mirror(clock, 0);
                break;
            }
        }

        if (address == 0x9002 || address == 0x9003) {
            this.swapMode = (data & 2) == 2; 
        }
    }

    vrcmirroring = this.vrc4mirroring;

    useMicrowire () {
        this.GetByte = this.getByteMicrowire;
        this.microwire = true;
        
    }  
    
    getByteMicrowire(clock: number, address: number) : number {
        // LDA $6100 and LDA $6000 will return $60|latch
        if (address >= 0x6000 && address <= 0x7FFF ) {
            return (address >> 8) | this.microwireLatch;
        }
        return this.peekByte(address);
    }

    SetByte(clock:number, address:number, data: number) {
        switch(address & 0xf000) {
            case 0x6000:
            case 0x7000:
                if (this.microwire) {
                    this.microwireLatch = data & 0x1;
                } else {
                    this.prgRomBank6[data & this.ramMask] = data;
                }
                break;
            case 0x8000:
                let bank8 = data & 0x1F;
                if (this.swapMode) {
                    this.SetupBankStarts(this.prgRomCount * 2 - 2, this.currentA, bank8, this.currentE);
                } else {
                    this.SetupBankStarts(bank8, this.currentA, this.prgRomCount * 2 - 2, this.currentE);
                }           
                break;      
            case 0x9000:
                this.vrcmirroring(clock, address, data);
                break;
            case 0xa000:
                // 8kib prg rom at A000
                let bankA = data & 0x1F;
                this.SetupBankStarts(this.current8, bankA, this.currentC, this.currentE);
                break;
            case 0xb000:
            case 0xc000:
            case 0xd000:
            case 0xe000:
                const addmask = address & this.regMask;
                const bank = ((address >> 12) & 0xf) - 0xb;
                const index = bank << 1;
                if (addmask == this.regNums[0]) {
                    this.latches[index]  =  (this.latches[index] & 0xf0) | (data & 0xf);
                    this.copyBanks1k(clock, index, this.latches[index], 1);
                } else if (addmask == this.regNums[1]) {
                    this.latches[index]  =  (this.latches[index] & 0xf) | ((data << 4) & 0xf0);
                    this.copyBanks1k(clock, index, this.latches[index], 1);
                } else if (addmask == this.regNums[2]) {
                    this.latches[index + 1]  =  (this.latches[index + 1] & 0xf0) | (data & 0xf);
                    this.copyBanks1k(clock, index + 1, this.latches[index + 1], 1);
                } else if (addmask == this.regNums[3]) {
                    this.latches[index + 1]  =  (this.latches[index + 1] & 0xf) | ((data << 4) & 0xf0);
                    this.copyBanks1k(clock, index + 1, this.latches[index + 1], 1);
                }
                break;
            case 0xf000:
                if ((address & 0x3) == 0x0) {
                    this.irqLatch = (this.irqLatch & 0xf0) | (data & 0xf); 
                } else if ((address & 0x3) == 0x1) {
                    this.irqLatch = (this.irqLatch & 0x0f) | ((data << 4) & 0xf0);  
                } else if ((address & 0x3) == 0x2) {
                    this.irqControl = data;
                } else if ((address & 0x3) == 0x3) {
                    this.ackIrq();
                }
                break;

        }

        // const map = this.writeMap;
        // for (let i =0;i < map.length; ++i) {
        //     const x = map[i].mask & address;
        //     if (map[i].address.find( (v) => {
        //         return v ==  x; 
        //     })) {
        //         map[i].func(clock, address,data);
        //         return;
        //     }
        // }
    }

}

export class KonamiVRC2Cart extends VRC2or4Cart {

    altRegNums (){
        this.regNums = [
            0x00,
            0x04,
            0x08,
            0x0c,
        ];
        this.regMask = 0xf;
    }

    InitializeCart() {
        this.mapperName = 'KonamiVRC2';
        this.SetupBankStarts(0, 0, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        this.copyBanks4k(0, 0, 0, 2);

        switch (this.ROMHashFunction)
        {
            case 'CC9FFEC': // ganbare goemon 2 
            case 'B27B8CF4': // Gryzor (contra j)
                this.useMicrowire();
                break;
            case 'D467C0CC': // parodius da!
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

export class KonamiVRC022Cart extends VRC2or4Cart {
    InitializeCart() {
        this.mapperName = 'KonamiVRC2a';
        this.SetupBankStarts(0, 0, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        this.copyBanks4k(0, 0, 0, 2);
        this.regNums = [
            0x0,
            0x2,
            0x1,
            0x3,
        ];
        this.vrcmirroring = this.vrc2mirroring;
        this.useMicrowire();
        
        switch (this.ROMHashFunction) {
            case 'D4645E14':
            break;
        }
    }

    SetByte(clock:number, address:number, data: number) {
        switch(address & 0xf000) {
            case 0x6000:
            case 0x7000:
                if (this.microwire) {
                    this.microwireLatch = data & 0x1;
                } else {
                    this.prgRomBank6[data & this.ramMask] = data;
                }
                break;
            case 0x8000:
                let bank8 = data & 0x1F;
                if (this.swapMode) {
                    this.SetupBankStarts(this.prgRomCount * 2 - 2, this.currentA, bank8, this.currentE);
                } else {
                    this.SetupBankStarts(bank8, this.currentA, this.prgRomCount * 2 - 2, this.currentE);
                }           
                break;      
            case 0x9000:
                this.vrcmirroring(clock, address, data);
                break;
            case 0xa000:
                // 8kib prg rom at A000
                let bankA = data & 0x1F;
                this.SetupBankStarts(this.current8, bankA, this.currentC, this.currentE);
                break;
            case 0xb000:
            case 0xc000:
            case 0xd000:
            case 0xe000:
                const addmask = address & this.regMask;
                const bank = ((address >> 12) & 0xf) - 0xb;
                const index = bank << 1;
                if (addmask == this.regNums[0]) {
                    this.latches[index]  =  (this.latches[index] & 0xf0) | (data & 0xf);
                    this.copyBanks1k(clock, index, this.latches[index]  >> 1, 1);
                } else if (addmask == this.regNums[1]) {
                    this.latches[index]  =  (this.latches[index] & 0xf) | ((data << 4) & 0xf0);
                    this.copyBanks1k(clock, index, this.latches[index] >> 1, 1);
                } else if (addmask == this.regNums[2]) {
                    this.latches[index + 1]  =  (this.latches[index + 1] & 0xf0) | (data & 0xf);
                    this.copyBanks1k(clock, index + 1, this.latches[index + 1] >> 1, 1);
                } else if (addmask == this.regNums[3]) {
                    this.latches[index + 1]  =  (this.latches[index + 1] & 0xf) | ((data << 4) & 0xf0);
                    this.copyBanks1k(clock, index + 1, this.latches[index + 1] >> 1, 1);
                }
                break;
            case 0xf000:
                if ((address & 0x3) == 0x0) {
                    this.irqLatch = (this.irqLatch & 0xf0) | (data & 0xf); 
                } else if ((address & 0x3) == 0x1) {
                    this.irqLatch = (this.irqLatch & 0x0f) | ((data << 4) & 0xf0);  
                } else if ((address & 0x3) == 0x2) {
                    this.irqControl = data;
                } else if ((address & 0x3) == 0x3) {
                    this.ackIrq();
                }
                break;

        }

        // const map = this.writeMap;
        // for (let i =0;i < map.length; ++i) {
        //     const x = map[i].mask & address;
        //     if (map[i].address.find( (v) => {
        //         return v ==  x; 
        //     })) {
        //         map[i].func(clock, address,data);
        //         return;
        //     }
        // }
    }


}

export class Konami021Cart extends VRC2or4Cart {

    InitializeCart() {
        this.mapperName = 'KonamiVRC2';
        this.SetupBankStarts(0, 0, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        this.copyBanks4k(0, 0, 0, 2);
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
                this.regMask = 0xf0;
                this.ramMask = 0x1fff;
            break;
        }
    }
}

export class Konami025Cart extends VRC2or4Cart {

    InitializeCart() {
        this.mapperName = 'KonamiVRC4';
        this.SetupBankStarts(0, 0, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        this.copyBanks4k(0, 0, 1, 1);
        this.copyBanks4k(0, 1, 0, 1);
        this.regNums = [0x000, 0x002, 0x001, 0x003];
        this.regMask = 0xf;
        switch (this.ROMHashFunction)
        {
            case '4A601A2C': // teenage mutant ninja turtles j
                this.regNums = [
                    0x000, 0x008, 0x004, 0x00C
                ];
            break;
        }
    }

}
