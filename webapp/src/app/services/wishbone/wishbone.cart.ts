import { BaseCart, ChiChiCPPU } from 'chichi';

export class WishboneCart {

    realCart: BaseCart = null;

    Whizzler: ChiChiCPPU;
    CPU: ChiChiCPPU;
    ChrRom: any;
    ChrRamStart: number;
    PPUBankStarts: any;
    ROMHashFunction: string;
    CheckSum: string;
    SRAM: any;
    Mirroring: ChiChiNES.NameTableMirroring;
    CartName: string;

    get NumberOfPrgRoms(): number {
        return this.realCart ? this.realCart.NumberOfPrgRoms : -1;
    }

    get NumberOfChrRoms(): number {
        return this.realCart ? this.realCart.NumberOfChrRoms : -1;
    }

    get MapperID(): number {
        return this.realCart ? this.realCart.MapperID : -1;
    }

    get MapperName(): string {
        return this.realCart ? this.realCart.MapperName : '';
    }

    get submapperId(): number {
        return this.realCart.submapperId > 0 ? this.realCart.submapperId : 0;
    }


    BankSwitchesChanged: boolean;
    BankStartCache: any;
    CurrentBank: number;

    UsesSRAM: boolean;

    NMIHandler: () => void;

    IRQAsserted: boolean;

    NextEventAt: number;

    GetPPUByte(clock: number, address: number): number {
        if (this.realCart) {
            return this.realCart.GetPPUByte(clock, address);
        } else {
            return 0;
        }
    }

    GetByte(Clock: number, address: number): number {
        if (this.realCart) {
            return this.realCart.GetByte(Clock, address);
        } else  {
            return 0;
        }
    }


}
