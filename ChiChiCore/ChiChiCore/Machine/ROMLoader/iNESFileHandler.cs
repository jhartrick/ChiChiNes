using System;

namespace ChiChiNES.ROMLoader
{
    public static class iNESFileHandler
    {
        public static INESCart LoadROM(IPPU ppu, byte[] thefile)
        {
            INESCart _cart = null;
            byte[] iNesHeader = new byte[16];
            int bytesRead = 16;
            Array.Copy(thefile,iNesHeader, 16);
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
            int mapperId = (iNesHeader[6] & 0xF0);
            mapperId = mapperId / 16;
            mapperId += iNesHeader[7];

            int prgRomCount = iNesHeader[4];
            int chrRomCount = iNesHeader[5];

            byte[] theRom = new byte[prgRomCount * 0x4000];
            byte[] chrRom = new byte[chrRomCount * 0x4000];

            int chrOffset = 0;

            //bytesRead = zipStream.Read(theRom, 0, theRom.Length);
            Array.Copy(thefile, 16, theRom, 0, theRom.Length);
            chrOffset = 16 + theRom.Length;
            var len = chrRom.Length;
            if (chrOffset + chrRom.Length > thefile.Length)
            {
                len = thefile.Length - chrOffset;
            }
            Array.Copy(thefile, chrOffset, chrRom, 0, len);
            //zipStream.Read(chrRom, 0, chrRom.Length);
            switch (mapperId)
            {
                case 0:
                case 2:
                case 3:
                case 7:
                    _cart = new CPU.NESCart();

                    break;
                case 1:
                    _cart = new NesCartMMC1();
                    break;
                case 4:
                    _cart = new NesCartMMC3();
                    
                    break;
            }

            if (_cart != null)
            {
                _cart.Whizzler = ppu;
                ppu.ChrRomHandler = _cart;
                _cart.ROMHashFunction = null;//Hashers.HashFunction;
                _cart.LoadiNESCart(iNesHeader, prgRomCount, chrRomCount, theRom, chrRom, chrOffset);
            }

            return _cart;

        }



    }
}
