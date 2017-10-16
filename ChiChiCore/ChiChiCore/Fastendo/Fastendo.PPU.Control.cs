using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChiChiNES
{
    public partial class CPU2A03
    {

        //0..19:	Starting at the instant the VINT flag is pulled down (when a NMI is 
        //generated), 20 scanlines make up the period of time on the PPU which I like 
        //to call the VINT period. During this time, the PPU makes no access to it's 
        //external memory (i.e. name / pattern tables, etc.).

        //20:	After 20 scanlines worth of time go by (since the VINT flag was set), 
        //the PPU starts to render scanlines. This first scanline is a dummy one; 
        //although it will access it's external memory in the same sequence it would 
        //for drawing a valid scanline, no on-screen pixels are rendered during this 
        //time, making the fetched background data immaterial. Both horizontal *and* 
        //vertical scroll counters are updated (presumably) at cc offset 256 in this 
        //scanline. Other than that, the operation of this scanline is identical to 
        //any other. The primary reason this scanline exists is to start the object 
        //render pipeline, since it takes 256 cc's worth of time to determine which 
        //objects are in range or not for any particular scanline.

        //21..260: after rendering 1 dummy scanline, the PPU starts to render the 
        //actual data to be displayed on the screen. This is done for 240 scanlines, 
        //of course.

        //261:	after the very last rendered scanline finishes, the PPU does nothing 
        //for 1 scanline (i.e. the programmer gets screwed out of perfectly good VINT 
        //time). When this scanline finishes, the VINT flag is set, and the process of 
        //drawing lines starts all over again.


        // 89342 ppu clocks per frame
        // 262 scanlines * 341 clocks per scanline
        // about 20 scanlines of vblank = 6820
        // 240 lines rendered
        const int ScanlinePreRenderDummyScanline = 20;
        const int ScanlineRenderingStartsOn = 21;
        const int ScanlineRenderingEndsOn = 260;

        // vblank thrown at end of this line (dummy line before vblank thrown, not drawn)

        // this resets counter to 0 (is not run)

        // length of a scanline, rendered stays 256.  
        //    increasing total length from 340 overclocks the cpu

        const int ScanlineLastRenderedPixel = 255;
        const int ScanlineTotalLength = 340;
        //const int ScanlineTotalLength = 340;

        const int ScanlineEventPPUXIncremented = 3;
        const int ScanlineEventPPUXReset = 257;
        const int ScanlineEventPPUYIncremented = 251;

        protected int currentXPosition = 0, currentYPosition = 0;
        const int vBufferWidth = 0x100;


        // hscroll, vscroll represent the latches written to by 2005, 2006
        protected int _hScroll = 0;
        protected int _vScroll = 0;
        protected int lockedHScroll = 0, lockedVScroll = 0;

        public int PPU_HScroll
        {
            get { return lockedHScroll; }
        }

        public int PPU_VScroll
        {
            get { return lockedVScroll; }
        }

        public int PPU_CurrentYPosition
        {
            get { return currentYPosition; }
        }

        public int PPU_CurrentXPosition
        {
            get { return currentXPosition; }
        }

        int scanlineNum = 0, scanlinePos = 0;


        public int PPU_ScanlinePos
        {
            get { return scanlinePos; }
        }

        public int PPU_ScanlineNum
        {
            get { return scanlineNum; }
        }


        static void PPU_PixelWhizzler()
        {



            for (int i = 0; i < 32; ++i)
            {
                _powersOfTwo[i] = (int)Math.Pow(2.0, (double)i);
            }
        }

        private static int[] _powersOfTwo = new int[32];

        public static int[] PPU_PowersOfTwo
        {
            get
            {
                return _powersOfTwo;
            }
        }


        private bool _isDebugging;

        public bool PPU_IsDebugging
        {
            get { return _isDebugging; }
            set { _isDebugging = value; }
        }


        public void PPU_Initialize()
        {
            _PPUAddress = 0;
            _PPUStatus = 0;
            _PPUControlByte0 = 0;
            _PPUControlByte1 = 0;
            _hScroll = 0;
            scanlineNum = 0;
            scanlinePos = 0;
            _spriteAddress = 0;
        }

        public void PPU_WriteState(Queue<int> writer)
        {

            writer.Enqueue(_PPUStatus);
            writer.Enqueue(_PPUControlByte0);
            writer.Enqueue(_hScroll);
            writer.Enqueue(_vScroll);
            writer.Enqueue(scanlineNum);
            writer.Enqueue(scanlinePos);
            writer.Enqueue(currentYPosition);
            writer.Enqueue(currentXPosition);
            writer.Enqueue(nameTableIndex);
            writer.Enqueue(_backgroundPatternTableIndex);


            writer.Enqueue(patternEntry);
            writer.Enqueue(patternEntryByte2);
            writer.Enqueue(currentAttributeByte);
            writer.Enqueue(xNTXor);
            writer.Enqueue(yNTXor);
            writer.Enqueue(fetchTile ? 0 : 1);
            writer.Enqueue(xPosition);
            writer.Enqueue(yPosition);


            writer.Enqueue(lastcpuClock);
            writer.Enqueue(vbufLocation);


            for (int i = 0; i < 0x4000; i += 4)
            {

                writer.Enqueue(chrRomHandler.GetPPUByte(0, i) << 24 |
                                    (chrRomHandler.GetPPUByte(0, i + 1) << 16) |
                                    (chrRomHandler.GetPPUByte(0, i + 2) << 8) |
                                    (chrRomHandler.GetPPUByte(0, i + 3) << 0)

                        );
            }
            writer.Enqueue(_spriteAddress);

            for (int i = 0; i < 0x100; i += 4)
            {

                writer.Enqueue((spriteRAM[i] << 24) |
                                    (spriteRAM[i + 1] << 16) |
                                    (spriteRAM[i + 2] << 8) |
                                    (spriteRAM[i + 3])
                        );
            }

            for (int i = 0; i < pal.Length; i += 4)
            {

                writer.Enqueue((pal[i] << 24) |
                                    (pal[i + 1] << 16) |
                                    (pal[i + 2] << 8) |
                                    (pal[i + 3])
                        );
            }

            for (int i = 0; i < _palette.Length; i += 4)
            {

                writer.Enqueue((_palette[i] << 24) |
                                    (_palette[i + 1] << 16) |
                                    (_palette[i + 2] << 8) |
                                    (_palette[i + 3])
                        );
            }

        }

        public void PPU_ReadState(Queue<int> state)
        {
            _PPUStatus = state.Dequeue();
            _PPUControlByte0 = state.Dequeue();
            _hScroll = state.Dequeue();
            _vScroll = state.Dequeue();
            scanlineNum = state.Dequeue();
            scanlinePos = state.Dequeue();
            currentYPosition = state.Dequeue();
            currentXPosition = state.Dequeue();
            nameTableIndex = state.Dequeue();
            _backgroundPatternTableIndex = state.Dequeue();
            //_mirroring= state.Dequeue();
            //oneScreenMirrorOffset= state.Dequeue();
            //currentMirrorMask= state.Dequeue();

            patternEntry = state.Dequeue();
            patternEntryByte2 = state.Dequeue();
            currentAttributeByte = state.Dequeue();
            xNTXor = state.Dequeue();
            yNTXor = state.Dequeue();
            fetchTile = (state.Dequeue() == 1);
            xPosition = state.Dequeue();
            yPosition = state.Dequeue();

            lastcpuClock = state.Dequeue();
            vbufLocation = state.Dequeue();

            int packedByte = 0;
            for (int i = 0; i < 0x4000; i += 4)
            {
                packedByte = state.Dequeue();
                chrRomHandler.SetByte(0, i, (byte)(packedByte >> 24));
                chrRomHandler.SetByte(0, i + 1, (byte)(packedByte >> 16));
                chrRomHandler.SetByte(0, i + 2, (byte)(packedByte >> 8));
                chrRomHandler.SetByte(0, i + 3, (byte)(packedByte));
            }

            _spriteAddress = state.Dequeue();

            for (int i = 0; i < 0x100; i += 4)
            {
                packedByte = state.Dequeue();
                spriteRAM[i] = (byte)(packedByte >> 24);
                spriteRAM[i + 1] = (byte)(packedByte >> 16);
                spriteRAM[i + 2] = (byte)(packedByte >> 8);
                spriteRAM[i + 3] = (byte)(packedByte);
            }

            for (int i = 0; i < pal.Length; i += 4)
            {
                packedByte = state.Dequeue();
                pal[i] = (byte)(packedByte >> 24);
                pal[i + 1] = (byte)(packedByte >> 16);
                pal[i + 2] = (byte)(packedByte >> 8);
                pal[i + 3] = (byte)(packedByte);
            }

            for (int i = 0; i < _palette.Length; i += 4)
            {
                packedByte = state.Dequeue();
                _palette[i] = (byte)(packedByte >> 24);
                _palette[i + 1] = (byte)(packedByte >> 16);
                _palette[i + 2] = (byte)(packedByte >> 8);
                _palette[i + 3] = (byte)(packedByte);
            }

            PPU_UnpackSprites();
            PPU_PreloadSprites(scanlineNum);

        }

        bool NMIOccurred
        {
            get { return (_PPUStatus & 0x80) == 0x80; }
        }

        bool NMIHasBeenThrownThisFrame = false;

        public void PPU_SetupVINT()
        {
            _PPUStatus = _PPUStatus | 0x80;
            NMIHasBeenThrownThisFrame = false;
            // HandleVBlankIRQ = true;
            _frames = _frames + 1;
            //isRendering = false;

            if (PPU_NMIIsThrown)
            {
                nmiHandler();
                PPU_HandleVBlankIRQ = true;
                NMIHasBeenThrownThisFrame = true;
            }

        }


  
    }
}
