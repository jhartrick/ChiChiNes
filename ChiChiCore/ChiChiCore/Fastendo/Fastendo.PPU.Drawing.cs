using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ChiChiNES.Interaction;
using ChiChiNES;
using Bridge;

namespace ChiChiNES
{
    public partial class CPU2A03
    {

        protected int lastcpuClock;

        public int LastcpuClock
        {
            get { return lastcpuClock; }
            set { lastcpuClock = value; }
        }
        /// <summary>
        /// draws from the lastcpuClock to the current one
        /// </summary>
        /// <param name="cpuClockNum"></param>
        [Rules(Integer = IntegerRule.Plain )]
        public void DrawTo(int cpuClockNum)
        {
            int frClock = (cpuClockNum - lastcpuClock )* 3;
            
            //// if we are in vblank 
            if (frameClock < 6820)
            {
                // if the frameclock +frClock is in vblank (< 6820) dont do nothing, just update it
                if (frameClock + frClock < 6820)
                {
                    frameClock += frClock;
                    frClock = 0;
                }
                else
                {
                    //find number of pixels to draw since frame start
                    frClock += frameClock - 6820;
                    frameClock = 6820;
                }
            }
            for (int i = 0; i < frClock; ++i)
            {
                switch (frameClock++)
                {
                    case 0:
                        //frameFinished();
                        break;
                    case 6820:
                        //PPU_ClearVINT();
                        _PPUStatus = 0;
                        hitSprite = false;
                        spriteSize = ((_PPUControlByte0 & 0x20) == 0x20) ? 16 : 8;
                        if ((_PPUControlByte1 & 0x18) != 0)
                        {
                            isRendering = true;
                        }

                        frameOn = true;

                        chrRomHandler.ResetBankStartCache();
                        // setFrameOn();
                        if (spriteChanges)
                        {
                            PPU_UnpackSprites();
                            spriteChanges = false;
                        }


                        break;
                    case 7161:
                        //lockedVScroll = _vScroll;
                        vbufLocation = 0;
                        //curBufPos = bufStart;

                        xNTXor = 0x0;
                        yNTXor = 0;
                        currentXPosition = 0;
                        currentYPosition = 0;

                        break;

                    case frameClockEnd:
                        //if (fillRGB) FillBuffer();
                        shouldRender = true;
                        __frameFinished = true;
                        frameFinished();

                        PPU_SetupVINT();
                        frameOn = false;
                        frameClock = 0;

                        //if (_isDebugging)
                        //    events.Clear();

                        break;
                }

                if (frameClock >= 7161 && frameClock <= 89342)
                {


                    if (currentXPosition < 256 && vbufLocation < 256 * 240)
                    {
                        /* update x position */
                        xPosition = currentXPosition + lockedHScroll;


                        if ((xPosition & 7) == 0)
                        {
                            xNTXor = ((xPosition & 0x100) == 0x100) ? 0x400 : 0x00;
                            xPosition &= 0xFF;

                            /* fetch next tile */
                            int ppuNameTableMemoryStart = nameTableMemoryStart ^ xNTXor ^ yNTXor;

                            int xTilePosition = xPosition >> 3;

                            //int tileRow = (yPosition >> 3) % 30 << 5;

                            //int tileNametablePosition = 0x2000 + ppuNameTableMemoryStart + xTilePosition + tileRow;

                            int TileIndex = chrRomHandler.GetPPUByte(0, 0x2000 + ppuNameTableMemoryStart + xTilePosition + ((yPosition >> 3) % 30 << 5));

                            int patternTableYOffset = yPosition & 7;

                            int patternID = _backgroundPatternTableIndex + (TileIndex * 16) + patternTableYOffset;

                            patternEntry = chrRomHandler.GetPPUByte(0, patternID);
                            patternEntryByte2 = chrRomHandler.GetPPUByte(0, patternID + 8);

                            currentAttributeByte = GetAttributeTableEntry(ppuNameTableMemoryStart, xTilePosition, yPosition >> 3);
                            /*end fetch next tile */

                        }

                        /* draw pixel */
                        int tilePixel = _tilesAreVisible ? PPU_GetNameTablePixel() : 0;
                       // bool foregroundPixel = isForegroundPixel;
                        int spritePixel = _spritesAreVisible ? PPU_GetSpritePixel() : 0;
                        
                        if (!hitSprite && spriteZeroHit && tilePixel != 0)
                        {
                            hitSprite = true;
                            _PPUStatus = _PPUStatus | 0x40;
                        }

                        //var x = pal[_palette[(foregroundPixel || (tilePixel == 0 && spritePixel != 0)) ? spritePixel : tilePixel]];
                        //var x = 

                        byteOutBuffer[vbufLocation * 4] = _palette[(isForegroundPixel || (tilePixel == 0 && spritePixel != 0)) ? spritePixel : tilePixel];
                        //byteOutBuffer[(vbufLocation * 4) + 1] = x;// (byte)(x >> 8);
                        //byteOutBuffer[(vbufLocation * 4) + 2] = x;//  (byte)(x >> 16);
                        //byteOutBuffer[(vbufLocation * 4) + 3] = 0xFF;// (byte)(x);// (byte)rgb32OutBuffer[vbufLocation];

                        vbufLocation++;
                    }
                    if (currentXPosition == 256)
                    {
                        chrRomHandler.UpdateScanlineCounter();
                    }
                    currentXPosition++;

                    if (currentXPosition > 340)
                    {

                        currentXPosition = 0;
                        currentYPosition++;

                        PPU_PreloadSprites(currentYPosition);
                        if (spritesOnThisScanline >= 7)
                        {
                            _PPUStatus = _PPUStatus | 0x20;
                        }

                        lockedHScroll = _hScroll;

                        UpdatePixelInfo();

                        //PPU_RunNewScanlineEvents 
                        yPosition = currentYPosition + lockedVScroll;

                        if (yPosition < 0) { yPosition += 240; }
                        if (yPosition >= 240) {
                            yPosition -= 240;
                            yNTXor = 0x800;
                        }
                        else {
                            yNTXor = 0x00;
                        }

                    }

                }

            }
            lastcpuClock = cpuClockNum;
        }


        public int[] byteOutBuffer = new int[256 * 256 * 4];

        protected int[] outBuffer = new int[256 * 256];

        public int[] OutBuffer
        {
            get { return outBuffer; }
        }


        protected int vbufLocation;

        public void UpdatePixelInfo()
        {
            nameTableMemoryStart = nameTableBits * 0x400;
        }

        int[] drawInfo= new int[256*256];


        IPixelAwareDevice pixelDevices = null;

        public IPixelAwareDevice PixelAwareDevice
        {
            get { return pixelDevices; }
            set { pixelDevices = value; }
        }

        public int[] ByteOutBuffer { get { return byteOutBuffer; } set { byteOutBuffer = value; } }

        private bool _clipTiles;
        private bool _clipSprites;

    }
}
