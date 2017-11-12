import { IBaseCart, BaseCart, ChiChiCPPU } from 'chichi';

export class WishboneCart {
    name: string;
    get supported(): boolean {
        return this.realCart ? this.realCart.supported : false;
    }

    get prgRomCount(): number {
        return this.realCart ? this.realCart.prgRomCount : -1;
    }

    get chrRomCount(): number {
        return this.realCart ? this.realCart.chrRomCount : -1;
    }

    get mapperID(): number {
        return this.realCart ? this.realCart.mapperId : -1;
    }

    get mapperName(): string {
        return this.realCart ? this.realCart.mapperName : '';
    }

    get submapperId(): number {
        return this.realCart.submapperId > 0 ? this.realCart.submapperId : 0;
    }

    mapsBelow6000: boolean;
    irqRaised: boolean;
    realCart: BaseCart = null;

    Whizzler: ChiChiCPPU;
    CPU: ChiChiCPPU;
    ChrRom: any;
    ChrRamStart: number;
    PPUBankStarts: any;
    ROMHashFunction: string;
    SRAM: any;
    Mirroring: ChiChiNES.NameTableMirroring;
    CartName: string;

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
