import { BaseCart, ChiChiCPPU } from 'chichi';

export class WishboneCart {

    realCart: BaseCart = null;

    Whizzler: ChiChiCPPU;
    CPU: ChiChiCPPU;
    ChrRom: any;
    ChrRamStart: number;
    PPUBankStarts: any;
    ROMHashFunction: (prg: any, chr: any) => string;
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


    BankSwitchesChanged: boolean;
    BankStartCache: any;
    CurrentBank: number;

    UsesSRAM: boolean;

    LoadiNESCart(header: any, prgRoms: number, chrRoms: number, prgRomData: any, chrRomData: any, chrRomOffset: number): void {
        throw new Error('Method not implemented.');
    }
    InitializeCart(): void {
        throw new Error('Method not implemented.');
    }
    UpdateScanlineCounter(): void {
        throw new Error('Method not implemented.');
    }
    WriteState(state: any): void {
        throw new Error('Method not implemented.');
    }
    ReadState(state: any): void {
        throw new Error('Method not implemented.');
    }
    ActualChrRomOffset(address: number): number {
        throw new Error('Method not implemented.');
    }
    UpdateBankStartCache(): number {
        throw new Error('Method not implemented.');
    }
    ResetBankStartCache(): void {
        throw new Error('Method not implemented.');
    }

    NMIHandler: () => void;

    IRQAsserted: boolean;

    NextEventAt: number;

    GetPPUByte(clock: number, address: number): number {
        if (this.realCart)
            return this.realCart.GetPPUByte(clock, address);
        else
            return 0;
    }

    SetPPUByte(clock: number, address: number, data: number): void {
        throw new Error('Method not implemented.');
    }

    GetByte(Clock: number, address: number): number {
        if (this.realCart) {
            return this.realCart.GetByte(Clock, address);
        } else  {
            return 0;
        }
    }
    SetByte(Clock: number, address: number, data: number): void {
        throw new Error('Method not implemented.');
    }

    HandleEvent(Clock: number): void {
        throw new Error('Method not implemented.');
    }
    ResetClock(Clock: number): void {
        throw new Error('Method not implemented.');
    }

}