import { BaseCart } from "./BaseCart";


// MMC 
export class MMC1Cart extends BaseCart  {
    chrRomBankMode: number = 0;
    prgRomBankMode: number = 0;

    lastClock: number = 0;
    sequence = 0;
    accumulator = 0;
    bank_select = 0;
    _registers = new Array<number>(4);
    lastwriteAddress = 0;

    InitializeCart() {
        this.mapperName = 'MMC1';
        this.usesSRAM = true;
        this.ramMask = 0x1fff;
        if (this.chrRomCount > 0) {
            this.copyBanks(0,0, 0, 2);
        }
        this._registers[0] = 12;
        this._registers[1] = 0;
        this._registers[2] = 0;
        this._registers[3] = 0;

        this.SetupBankStarts(0, 1, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);

        this.sequence = 0;
        this.accumulator = 0;
    }

    SetByte(clock: number, address: number, val: number) {
        // if write is to a different register, reset
        this.lastClock = clock;
        switch (address & 0xf000) {
            case 0x6000:
            case 0x7000:
            this.prgRomBank6[address & 0x1fff] = val & 0xff;
                break;
            default:
                this.lastwriteAddress = address;
                if ((val & 128) === 128) {
                    this._registers[0] = this._registers[0] | 12;
                    this.accumulator = 0;
                    this.sequence = 0;
                } else {
                    if ((val & 1) === 1) {
                        this.accumulator = this.accumulator | (1 << this.sequence);
                    }
                    this.sequence = (this.sequence + 1) | 0;
                }
                if (this.sequence === 5) {
                    var regnum = (address & 32767) >> 13;
                    this._registers[(address & 32767) >> 13] = this.accumulator;
                    this.sequence = 0;
                    this.accumulator = 0;

                    switch (regnum) {
                        case 0:
                            this.setMMC1Mirroring(clock);
                            this.prgRomBankMode = (this._registers[0] >> 2 ) & 0x3;
                            this.chrRomBankMode = (this._registers[0] >> 4 ) & 0x1;
                            
                            break;
                        case 1:
                        case 2:
                            this.setMMC1ChrBanking(clock);
                            break;
                        case 3:
                            this.setMMC1PrgBanking();
                            break;
                    }

                }
                break;
        }

    }

    setMMC1ChrBanking(clock: number) {
        if (this.chrRomCount > 0) {
            if (this.chrRomBankMode === 1) {
                
                this.copyBanks4k(clock, 0, this._registers[1], 1);
                this.copyBanks4k(clock, 1, this._registers[2], 1);
            } else {
                this.copyBanks4k(clock, 0, this._registers[1], 1);
                this.copyBanks4k(clock, 1, this._registers[1] + 1, 1);
            }
        }
        this.bankSwitchesChanged = true;
    }

    setMMC1PrgBanking() {

        let reg = 0;

        if (this.prgRomCount === 32) {
            this.bank_select = (this._registers[1] & 16) << 1;

        } else {
            this.bank_select = 0;
        }

        switch (this.prgRomBankMode){
            case 0:
            case 1:
                reg = (((this._registers[3] >> 1) & 0xf) << 2) + this.bank_select;
                this.SetupBankStarts(reg, reg + 1, reg + 2, reg + 3);
                break;
            case 2:
                reg = (this._registers[3] << 1) + this.bank_select;
                this.SetupBankStarts(0, 1, reg, reg + 1);
                break;
            case 3:
                reg = (this._registers[3] << 1) + this.bank_select;
                this.SetupBankStarts(reg, reg + 1, (this.prgRomCount << 1) - 2, (this.prgRomCount << 1) - 1);
            break;
        }

    }

    setMMC1Mirroring(clock: number) {
        switch (this._registers[0] & 3) {
            case 0:
                this.oneScreenOffset = 0;
                this.mirror(clock, 0);
                break;
            case 1:
                this.oneScreenOffset = 1024;
                this.mirror(clock, 0);
                break;
            case 2:
                this.mirror(clock, 1);
                break;
            case 3:
                this.mirror(clock, 2);
                                break;
        }
        this.bankSwitchesChanged = true;
    }


}

