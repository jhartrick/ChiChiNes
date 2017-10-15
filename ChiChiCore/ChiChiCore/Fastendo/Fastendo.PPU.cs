using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChiChiNES
{
    public partial class CPU2A03
    {


        //+----------------+
        //|2C02 programming|
        //+----------------+
        //This section lays out how 2C02 ports & programmable internal memory 
        //structures are organized. Names for these ports throughout the document will 
        //simply consist of adding $200 to the end of the number (i.e., $2002). 
        //Anything not explained here will be later on.




        //Readable 2C02 registers
        //-----------------------
        //reg	bit	desc
        //---	---	----
        //2	5	more than 8 objects on a single scanline have been detected in the last 
        //frame
        //    6	a primary object pixel has collided with a playfield pixel in the last 
        //frame
        //    7	vblank flag

        //4	-	object attribute memory write port (incrementing port 3 thenafter)

        //7	-	PPU memory read port.


        //Object attribute structure (4*8 bits)
        //-------------------------------------
        //ofs	bit	desc
        //---	---	----
        //0	-	scanline coordinate minus one of object's top pixel row.

        //1	-	tile index number. Bit 0 here controls pattern table selection when reg 
        //0.5 = 1.

        //2	0	palette select low bit
        //    1	palette select high bit
        //    5	object priority (> playfield's if 0; < playfield's if 1)
        //    6	apply bit reversal to fetched object pattern table data
        //    7	invert the 3/4-bit (8/16 scanlines/object mode) scanline address used to 
        //access an object tile

        //3	-	scanline pixel coordite of most left-hand side of object.

        //private static string palResString
        //{
        //    get
        //    {

        //        foreach (string s in System.Reflection.Assembly.GetExecutingAssembly().GetManifestResourceNames())
        //        {
        //            if (s.EndsWith("bnes.pal"))
        //            {
        //                return s;
        //            }
        //        }
        //        return null;
        //    }
        //}

        private bool shouldRender = false;

        public bool PPU_ShouldRender
        {
            get { return shouldRender; }
            set { shouldRender = value; }
        }

        private byte[] vBuffer;


        private int nameTableIndex;
        private int _frames = 0;




        public int PPU_VidRAM_GetNTByte(int address)
        {
            int result = 0;
            if (address >= 0x2000 && address < 0x3000)
            {

                result = chrRomHandler.GetPPUByte(0, address);

            }
            else
            {
                result = chrRomHandler.GetPPUByte(0, address);
            }
            return result;
        }

        protected bool hitSprite = false;

        public bool PPU_HandleVBlankIRQ
        {
            get;
            set;
        }


        private int[] VROM
        {
            get;
            set;
        }

        protected int _PPUControlByte0;

        protected int _PPUControlByte1;

        #region control byte 0 members

        public int PPU_PPUControlByte0
        {
            get { return _PPUControlByte0; }
            set
            {
                if (_PPUControlByte0 != value)
                {
                    _PPUControlByte0 = value;
                    UpdatePPUControlByte0();
                }
            }
        }

        private void UpdatePPUControlByte0()
        {
            if ((_PPUControlByte0 & 0x10) == 0x10)
                _backgroundPatternTableIndex = 0x1000;
            else
                _backgroundPatternTableIndex = 0;
        }

        public bool PPU_NMIIsThrown
        {
            get { return (_PPUControlByte0 & 0x80) == 0x80; }
        }

        #endregion

        #region control byte 1 members

        public int PPU_PPUControlByte1
        {
            get { return _PPUControlByte1; }
            set { _PPUControlByte1 = value; }
        }

        public bool PPU_BackgroundVisible
        {
            get { return _tilesAreVisible; }
        }


        protected bool _spritesAreVisible;
        protected bool _tilesAreVisible;

        public bool PPU_SpritesAreVisible
        {
            get { return _spritesAreVisible; }
        }

        #endregion


        protected int _PPUStatus;

        public int PPU_PPUStatus
        {
            get { return _PPUStatus; }
            set { _PPUStatus = value; }
        }

        protected int _PPUAddress;

        public int PPU_PPUAddress
        {
            get { return _PPUAddress; }
            set { _PPUAddress = value; }
        }


       private int ppuReadBuffer;


        private bool PPUAddressLatchIsHigh = true;



        //public int[] LoadPalABGR()
        //{
        ////Open App.Path & "\" + file For Binary As #FileNum

        //    using (Stream stream = System.Reflection.Assembly.GetExecutingAssembly().GetManifestResourceStream(palResString))
        //    {
        //        for (int n = 0 ; n < 64; ++n)
        //        {
        //            int r = stream.ReadByte();
        //            int g = stream.ReadByte();
        //            int b = stream.ReadByte();
        //            pal[n] = (0xFF <<24) | (r << 16) | (g << 8) | b;
        //            pal[n + 64] = pal[n];
        //            pal[n + 128] = pal[n];
        //            pal[n + 192] = pal[n];
        //            //Console.WriteLine(
        //            //    string.Format("float4({0}, {1}, {2}, 1.0), ", 
        //            //        ((float)r / 256.0f),  ((float)g / 256.0f), ((float)b / 256.0f) ));
        //        }
        //    }


        //    return pal;
        //}

        //public static int[] GetPalABGR()
        //{
        //    //Open App.Path & "\" + file For Binary As #FileNum
        //    int[] tPal = new int[256];
        //    using (Stream stream = System.Reflection.Assembly.GetExecutingAssembly().GetManifestResourceStream(palResString))
        //    {
        //        for (int n = 0; n < 64; ++n)
        //        {
        //            int r = stream.ReadByte();
        //            int g = stream.ReadByte();
        //            int b = stream.ReadByte();
        //            tPal[n] = (0xFF << 24) | (r << 16) | (g << 8) | b;
        //            tPal[n + 64] = pal[n];
        //            tPal[n + 128] = pal[n];
        //            tPal[n + 192] = pal[n];
        //        }
        //    }
        //    return tPal;
        //}

        public static int[] GetPalRGBA()
        {
            //Open App.Path & "\" + file For Binary As #FileNum
            for (int n = 0; n < 64; ++n)
            {
                pal[n + 64] = pal[n];
                pal[n + 128] = pal[n];
                pal[n + 192] = pal[n];
            }
            return pal;
        }


        /// <summary>
        /// Initializes the rendering pallette with the bytes in a BGR format, instead of the default RGB format
        /// </summary>
        //public void LoadPalRGBA()
        //{
        //    //Open App.Path & "\" + file For Binary As #FileNum

        //    using (Stream stream = System.Reflection.Assembly.GetExecutingAssembly().GetManifestResourceStream(palResString))
        //    {
        //        for (int n = 0; n < 64; ++n)
        //        {
        //            byte r = (byte)stream.ReadByte();
        //            byte g = (byte)stream.ReadByte();
        //            byte b = (byte)stream.ReadByte();
        //            pal[n] = (b << 16) | (g << 8) | (r << 0);
        //            pal[n + 64] = pal[n];
        //            pal[n + 128] = pal[n];
        //            pal[n + 192] = pal[n];
        //        }
        //    }
        //}


        int[] p32 = new int[256];
        public static int[] pal = new int[256] { 7961465, 10626572, 11407400, 10554206, 7733552, 2753820, 725017, 271983, 278855, 284436, 744967, 3035906, 7161605, 0, 131586, 131586, 12566719, 14641430, 15614283, 14821245, 12196292, 6496468, 2176980, 875189, 293472, 465210, 1597716, 5906953, 11090185, 2961197, 197379, 197379, 16316149, 16298569, 16588080, 16415170, 15560682, 12219892, 7115511, 4563694, 2277591, 2151458, 4513360, 1957181, 14604331, 6579811, 263172, 263172, 16447992, 16441012, 16634316, 16500447, 16236786, 14926838, 12831991, 11393781, 2287340, 5500370, 11858360, 14283440, 15921318, 13158344, 328965, 328965, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };

        protected int _backgroundPatternTableIndex;
        public int PPU_PatternTableIndex
        {
            get
            {
                return _backgroundPatternTableIndex;
            }
        }

        #region IPPU Members



        private bool isRendering = true;

        public bool PPU_IsRendering
        {
            get { return isRendering; }
        }

        // i have lines 0-20 as vblank, 21-260 rendered scanlines, 
        //261 is the do-nothing scanline when vblank is thrown and its time to draw.

        // note, lots of others document this as 0-239 are rendred, dummy, 241-261 vblank
        //  it seems to me it's 6 of one half dozen of the other, the numbering is abitrary

        public int frameClock = 0;
        public const int frameClockEnd = 89342;
        public bool FrameEnded = false;

        private bool frameOn = false;

        public bool FrameOn
        {
            get { return frameOn; }
            set { frameOn = value; }
        }


        int[] framePalette = new int[0x100];

        private int nameTableMemoryStart;

        public int PPU_NameTableMemoryStart
        {
            get { return nameTableMemoryStart; }
            set
            {
                nameTableMemoryStart = value;
            }
        }

        public byte[] CurrentFrame
        {
            get { return vBuffer; }
        }

        #endregion








    }
}
