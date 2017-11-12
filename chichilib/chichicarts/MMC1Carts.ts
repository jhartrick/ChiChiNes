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
        if (this.chrRomCount > 0) {
            this.CopyBanks(0,0, 0, 2);
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
        switch (address & 0xF000) {
            case 0x6000:
            case 0x7000:
                this.prgRomBank6[address & 8191] = val & 255;
                break;
            default:
                this.lastwriteAddress = address;
                if ((val & 128) === 128) {
                    this._registers[0] = this._registers[0] | 12;
                    this.accumulator = 0; // _registers[(address / 0x2000) & 3];
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
                        // 4bit0
                        // -----
                        // CPPMM
                        // |||||
                        // |||++- Mirroring (0: one-screen, lower bank; 1: one-screen, upper bank;
                        // |||               2: vertical; 3: horizontal)
                        // |++--- PRG ROM bank mode (0, 1: switch 32 KB at $8000, ignoring low bit of bank number;
                        // |                         2: fix first bank at $8000 and switch 16 KB bank at $C000;
                        // |                         3: fix last bank at $C000 and switch 16 KB bank at $8000)
                        // +----- CHR ROM bank mode (0: switch 8 KB at a time; 1: switch two separate 4 KB banks)
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
        //	bit 4 - sets 8KB or 4KB CHRROM switching mode
        // 0 = 8KB CHRROM banks, 1 = 4KB CHRROM banks
        this.Whizzler.DrawTo(clock);
        
        //if ((this._registers[0] & 16) === 16) {
        if (this.chrRomBankMode === 1) {
            this.CopyBanks4k(0, 0, this._registers[1], 1);
            this.CopyBanks4k(0, 1, this._registers[2], 1);
        } else {
            //CopyBanks(0, _registers[1], 2);
            this.CopyBanks4k(0, 0, this._registers[1], 1);
            this.CopyBanks4k(0, 1, ((this._registers[1] + 1) | 0), 1);
        }
        this.bankSwitchesChanged = true;

        this.Whizzler.UpdatePixelInfo();
    }

    setMMC1PrgBanking() {

        let reg = 0;

        if (this.prgRomCount === 32) {
            this.bank_select = (this._registers[1] & 16) << 1;

        } else {
            this.bank_select = 0;
        }

        // |++--- PRG ROM bank mode (0, 1: switch 32 KB at $8000, ignoring low bit of bank number;
        // |                         2: fix first bank at $8000 and switch 16 KB bank at $C000;
        // |                         3: fix last bank at $C000 and switch 16 KB bank at $8000)

        switch (this.prgRomBankMode){
            case 0:
            case 1:
                reg = (4 * ((this._registers[3] >> 1) & 0xF) + this.bank_select) | 0;
                this.SetupBankStarts(reg, reg + 1, reg + 2, reg + 3);
                break;
            case 2:
                reg = (2 * (this._registers[3]) + this.bank_select) | 0;
                this.SetupBankStarts(0, 1, reg, reg + 1);
                break;
            case 3:
                reg = (2 * (this._registers[3]) + this.bank_select) | 0;
                this.SetupBankStarts(reg, reg + 1, (this.prgRomCount << 1) - 2, (this.prgRomCount << 1) - 1);
            break;
        }

    }

    setMMC1Mirroring(clock: number) {
        //bit 1 - toggles between H/V and "one-screen" mirroring
        //0 = one-screen mirroring, 1 = H/V mirroring
        this.Whizzler.DrawTo(clock);
        switch (this._registers[0] & 3) {
            case 0:
                this.oneScreenOffset = 0;
                this.Mirror(clock, 0);
                break;
            case 1:
                this.oneScreenOffset = 1024;
                this.Mirror(clock, 0);
                break;
            case 2:
                this.Mirror(clock, 1); // vertical
                break;
            case 3:
                this.Mirror(clock, 2); // horizontal
                break;
        }
        this.bankSwitchesChanged = true;
        this.Whizzler.UpdatePixelInfo();
    }


}

