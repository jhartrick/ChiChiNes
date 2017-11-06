import { BaseCart } from "./BaseCart";

export class Smb2jCart extends BaseCart {
    InitializeCart() {
        this.mapperName = 'Smb2j';
        this.Setup6BankStarts(6, 4, 5, 1, 7);
        this.CopyBanks(0,0,0,1);
    }
    irqEnabled = false;
    irqCounter: number= 0;
    nextEventAt: number;
    handleNextEvent(clock: number) {
        // if (this.nextEventAt <= clock) {
        //     if (this.irqEnabled) {
        //         this.CPU._handleIRQ = true;
        //         this.irqEnabled = false;
        //         this.nextEventAt = 0;
        //     }
        // }
    };

    bank6start = 0;
    current6 = 0;
    advanceClock(value: number) {
        if (this.irqEnabled) {
            this.irqCounter -=value;
            if (this.irqCounter <= 0) {
                this.irqCounter = 0;
                this.Whizzler.DrawTo(this.CPU.clock);
                this.CPU._handleIRQ = true;
                this.irqEnabled = false;
            }
        }
    }
    
    Setup6BankStarts(reg6: number, reg8: number, regA: number, regC: number, regE: number): void {
        this.current6 = reg6 = this.MaskBankAddress(reg6);
        this.current8 = reg8 = this.MaskBankAddress(reg8);
        this.currentA = regA = this.MaskBankAddress(regA);
        this.currentC = regC = this.MaskBankAddress(regC);
        this.currentE = regE = this.MaskBankAddress(regE);

        this.bank6start = reg6 * 8192;
        this.bank8start = reg8 * 8192;
        this.bankAstart = regA * 8192;
        this.bankCstart = regC * 8192;
        this.bankEstart = regE * 8192;
    }


    GetByte(clock: number, address: number): number {
        var bank = 0;

        switch (address & 0xE000) {
            case 0x6000:
                bank = this.bank6start;
                break;
            case 0x8000:
                bank = this.bank8start;
                break;
            case 0xA000:
                bank = this.bankAstart;
                break;
            case 0xC000:
                bank = this.bankCstart;
                break;
            case 0xE000:
                bank = this.bankEstart;
                break;
        }
        return this.nesCart[bank + (address & 0x1FFF)];

    }
    
    SetByte(clock:number, address: number, data: number) {
        switch (address & 0xE000) {
        case 0x8000:
            this.irqRaised = false;
            this.irqEnabled = false;
        break;
        case 0xA000:
            this.irqEnabled = true;
            this.irqCounter = 4096;
            this.nextEventAt = clock + 4096;
        break;
        case 0xE000:
            this.Setup6BankStarts(this.current6, this.current8, this.currentA, data, this.currentE);
            break;
        } 
    }
}