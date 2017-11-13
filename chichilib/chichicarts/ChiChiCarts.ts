import { ChiChiCPPU } from '../chichi/ChiChiMachine';
import { ChiChiPPU } from '../chichi/ChiChiPPU';
import { BaseCart, UnsupportedCart, NameTableMirroring, IBaseCart } from './BaseCart';
import * as Discrete from './DiscreteCarts'
import * as Multi from './MultiCarts'
import * as MMC1 from './MMC1Carts'
import * as MMC2 from './MMC2Carts'
import * as MMC3 from './MMC3Carts'
import * as M068 from './Mapper068'
import * as Nsf from './Nsf031Cart'
import * as Smb2j from './Smb2jCart'
import * as crc from 'crc';
import * as  VS  from './VSCarts';
import * as VRC from './KonamiVRC1';
import * as VRC2 from './KonamiVRC2';
import * as VRC6 from './KonamiVRC6';
import * as Sunsoft from './Sunsoft';

class MapperFactory {
    0 = Discrete.NesCart;
    1 = MMC1.MMC1Cart;
    2 = Discrete.UxROMCart;
    3 = Discrete.CNROMCart;
    4 = MMC3.MMC3Cart;
    7 = Discrete.AxROMCart;
    9 = MMC2.MMC2Cart;
    10 = MMC2.MMC4Cart;
    11 = Discrete.ColorDreams;
    13 = Discrete.Mapper013Cart;
    21 = VRC2.Konami021Cart;
    22 = VRC2.KonamiVRC022Cart;
    23 = VRC2.KonamiVRC2Cart;
    24 = VRC6.Konami026Cart;
    25 = VRC2.Konami025Cart;
    26 = VRC6.Konami026Cart;
    30 = Discrete.Mapper030Cart;
    31 = Nsf.Mapper031Cart;
    34 = Discrete.BNROMCart;
    38 = Discrete.BitCorp038Cart;
    40 = Smb2j.Smb2jCart;
    51 = Multi.Mapper051Cart;
    58 = Multi.Mapper058Cart;
    66 = Discrete.MHROMCart;
    68 = M068.Mapper068Cart;
    70 = Discrete.Mapper070Cart;
    71 = Discrete.Mapper071Cart;
    75 = VRC.KonamiVRC1Cart;
    77 = Discrete.Mapper077Cart;
    78 = Discrete.Mapper078Cart;
    79 = Discrete.Mapper079Cart;
    81 = Discrete.Mapper081Cart;
    87 = Discrete.Mapper087Cart;
    89 = Sunsoft.Mapper089Cart;
    93 = Sunsoft.Mapper093Cart;
    94 = Discrete.Mapper094Cart;
    97 = Discrete.Irem097Cart;
    99 = VS.VSCart;
    140 = Discrete.JF1xCart;
    145 = Discrete.Mapper145Cart;
    151 = VRC.KonamiVRC1Cart;
    152 = Discrete.Mapper152Cart;
    180 = Discrete.NesCart;
    184 = Sunsoft.Mapper184Cart;
    190 = Discrete.Mapper190Cart;
    202 =  Multi.Mapper202Cart;
    212 = Multi.Mapper212Cart;

    createCart(mapper: number) : IBaseCart{
        if (this[mapper]) {
            return new this[mapper]();
        } else {
            return new UnsupportedCart();
        }
    }
}

export class iNESFileHandler  {
    

    static LoadROM(cpu: ChiChiCPPU, thefile: number[]): IBaseCart  {
        let _cart: IBaseCart = null;
        let mf = new MapperFactory();
        let iNesHeader = thefile.slice(0, 16);
        let bytesRead = 16;
        /* 
        .NES file format
        ---------------------------------------------------------------------------
        0-3      String "NES^Z" used to recognize .NES files.
        4        Number of 16kB ROM banks.
        5        Number of 8kB VROM banks.
        6        bit 0     1 for vertical mirroring, 0 for horizontal mirroring
        bit 1     1 for battery-backed RAM at $6000-$7FFF
        bit 2     1 for a 512-byte trainer at $7000-$71FF
        bit 3     1 for a four-screen VRAM layout 
        bit 4-7   Four lower bits of ROM Mapper Type.
        7        bit 0-3   Reserved, must be zeroes!
        bit 4-7   Four higher bits of ROM Mapper Type.
        8-15     Reserved, must be zeroes!
        16-...   ROM banks, in ascending order. If a trainer is present, its
        512 bytes precede the ROM bank contents.
        ...-EOF  VROM banks, in ascending order.
        ---------------------------------------------------------------------------
        */
        let mapperId = (iNesHeader[6] & 240);
        mapperId = mapperId >> 4;
        mapperId = mapperId | (iNesHeader[7] & 0xF0);

        
        // byte 7  lower bits PC10/VSUNI, xxPV 
        let isPC10 = (iNesHeader[7] & 0x2) == 0x2;
        let isVS = (iNesHeader[7] & 0x1) == 0x01;
        


// NES2.0 stuff 
        mapperId |= (iNesHeader[8] & 0xF) << 8;
        let submapperId = iNesHeader[8] >> 4;
// Byte 9 (Upper bits of ROM size)
        let upperPrgRomSize = iNesHeader[9] & 0xF;
        console.log('upperprgrom ' + upperPrgRomSize);
        let upperChrRomSize = (iNesHeader[9] & 0xF0) >> 4;
        console.log('upperChrRom ' + upperChrRomSize);
// byte 10 (RAM Size) 
        let prgRamBanks = iNesHeader[10]  & 0xF;
        let prgRamBanks_batteryBacked = (iNesHeader[10] >> 4) & 0xF;
// byte 11 (video RAM size) 
        let chrRamBanks = iNesHeader[11]  & 0xF;
        let chrRamBanks_batteryBacked = (iNesHeader[11] >> 4) & 0xF;

// byte 12 (video RAM size) 

        let prgRomCount: number = iNesHeader[4]; // | (upperPrgRomSize << 8);
        let chrRomCount: number = iNesHeader[5]; // | (upperChrRomSize << 8);
        const prgRomLength = prgRomCount * 16384;
        const chrRomLength = chrRomCount * 8192;
        const theRom = new Uint8Array(prgRomLength); 

        // System.Array.init(Bridge.Int.mul(prgRomCount, 16384), 0, System.Byte);
        theRom.fill(0);
        const chrRom = new Uint8Array(chrRomLength);
        chrRom.fill(0);

        // var chrRom = new Uint8Array(thefile.slice(16 + prgRomLength, 16 + prgRomLength + chrRomLength)); //System.Array.init(Bridge.Int.mul(chrRomCount, 16384), 0, System.Byte);
        // chrRom.fill(0);
        let chrOffset = 0;

// create cart
        // bytesRead = zipStream.Read(theRom, 0, theRom.Length);
        BaseCart.arrayCopy(thefile, 16, theRom, 0, theRom.length);
        chrOffset = (16 + theRom.length) | 0;
        let len = chrRom.length;
        if (((chrOffset + chrRom.length) | 0) > thefile.length) {
            len = (thefile.length - chrOffset) | 0;
        }
        BaseCart.arrayCopy(thefile, chrOffset, chrRom, 0, len);

        _cart = mf.createCart(mapperId);
        _cart.submapperId  = submapperId;

        if (_cart != null) {
            _cart.Whizzler = cpu.ppu;
            _cart.CPU = cpu;
            cpu.Cart = _cart;
            cpu.ppu.ChrRomHandler = _cart;
            _cart.LoadiNESCart(iNesHeader, prgRomCount, chrRomCount, theRom, chrRom, chrOffset);
        }

        return _cart;
    }



    static loadRomFile(thefile: number[]): IBaseCart  {
        let _cart: IBaseCart = null;
        let mf = new MapperFactory();
        let iNesHeader = thefile.slice(0, 16);
        let bytesRead = 16;
        /* 
        .NES file format
        ---------------------------------------------------------------------------
        0-3      String "NES^Z" used to recognize .NES files.
        4        Number of 16kB ROM banks.
        5        Number of 8kB VROM banks.
        6        bit 0     1 for vertical mirroring, 0 for horizontal mirroring
        bit 1     1 for battery-backed RAM at $6000-$7FFF
        bit 2     1 for a 512-byte trainer at $7000-$71FF
        bit 3     1 for a four-screen VRAM layout 
        bit 4-7   Four lower bits of ROM Mapper Type.
        7        bit 0-3   Reserved, must be zeroes!
        bit 4-7   Four higher bits of ROM Mapper Type.
        8-15     Reserved, must be zeroes!
        16-...   ROM banks, in ascending order. If a trainer is present, its
        512 bytes precede the ROM bank contents.
        ...-EOF  VROM banks, in ascending order.
        ---------------------------------------------------------------------------
        */
        let mapperId = (iNesHeader[6] & 240);
        mapperId = mapperId >> 4;
        mapperId = mapperId | (iNesHeader[7] & 0xF0);

        
        // byte 7  lower bits PC10/VSUNI, xxPV 
        let isPC10 = (iNesHeader[7] & 0x2) == 0x2;
        let isVS = (iNesHeader[7] & 0x1) == 0x01;
        


// NES2.0 stuff 
        mapperId |= (iNesHeader[8] & 0xF) << 8;
        let submapperId = iNesHeader[8] >> 4;
// Byte 9 (Upper bits of ROM size)
        let upperPrgRomSize = iNesHeader[9] & 0xF;
        console.log('upperprgrom ' + upperPrgRomSize);
        let upperChrRomSize = (iNesHeader[9] & 0xF0) >> 4;
        console.log('upperChrRom ' + upperChrRomSize);
// byte 10 (RAM Size) 
        let prgRamBanks = iNesHeader[10]  & 0xF;
        let prgRamBanks_batteryBacked = (iNesHeader[10] >> 4) & 0xF;
// byte 11 (video RAM size) 
        let chrRamBanks = iNesHeader[11]  & 0xF;
        let chrRamBanks_batteryBacked = (iNesHeader[11] >> 4) & 0xF;

// byte 12 (video RAM size) 

        let prgRomCount: number = iNesHeader[4]; // | (upperPrgRomSize << 8);
        let chrRomCount: number = iNesHeader[5]; // | (upperChrRomSize << 8);
        const prgRomLength = prgRomCount * 16384;
        const chrRomLength = chrRomCount * 8192;
        const theRom = new Uint8Array(prgRomLength); 

        // System.Array.init(Bridge.Int.mul(prgRomCount, 16384), 0, System.Byte);
        theRom.fill(0);
        const chrRom = new Uint8Array(chrRomLength);
        chrRom.fill(0);

        // var chrRom = new Uint8Array(thefile.slice(16 + prgRomLength, 16 + prgRomLength + chrRomLength)); //System.Array.init(Bridge.Int.mul(chrRomCount, 16384), 0, System.Byte);
        // chrRom.fill(0);
        let chrOffset = 0;

// create cart
        // bytesRead = zipStream.Read(theRom, 0, theRom.Length);
        BaseCart.arrayCopy(thefile, 16, theRom, 0, theRom.length);
        chrOffset = (16 + theRom.length) | 0;
        let len = chrRom.length;
        if (((chrOffset + chrRom.length) | 0) > thefile.length) {
            len = (thefile.length - chrOffset) | 0;
        }
        BaseCart.arrayCopy(thefile, chrOffset, chrRom, 0, len);

        _cart = mf.createCart(mapperId);
        _cart.submapperId  = submapperId;
        _cart.ROMHashFunction = crc.crc32(new Buffer(thefile.slice(16, thefile.length))).toString(16).toUpperCase(); //Hashers.HashFunction;
        _cart.LoadiNESCart(iNesHeader, prgRomCount, chrRomCount, theRom, chrRom, chrOffset);


        // if (_cart != null) {
        
        // }

        return _cart;
    }


}



