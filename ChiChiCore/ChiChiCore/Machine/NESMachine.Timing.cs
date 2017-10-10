using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ChiChiNES;

namespace ChiChiNES
{
    public partial class NESMachine
    {
        int _totalCPUClocks = 0;
        int frameCount = 0;

        //bool handlingNMI = false;
        /// <summary>
        /// runs a "step", either a pending non-maskable interrupt, maskable interupt, or a sprite DMA transfer,
        ///  or a regular machine cycle, then runs the appropriate number of PPU clocks based on CPU action
        ///  
        ///  ppuclocks = cpuclocks * 3
        ///  
        /// note: this approach relies on very precise cpu timing
        /// </summary>

        bool frameOn = true;
        bool frameJustEnded = false;


        public void Step()
        {
            if (frameJustEnded)
            {
                _cpu.FindNextEvent();
                frameOn = true;
                frameJustEnded = false;
            }
            _cpu.Step();

            if (!frameOn) {
                _totalCPUClocks = _cpu.Clock;
                //lock (_sharedWave)
                //{
                //    soundBopper.FlushFrame(_totalCPUClocks);
                //    soundBopper.EndFrame(_totalCPUClocks);
                //}
                _totalCPUClocks = 0;
                _cpu.Clock = 0;
                _ppu.LastcpuClock = 0;
                frameJustEnded = true;
            }
            //_cpu.Clock = _totalCPUClocks;
            //breakpoints: HandleBreaks();

        }

        public void RunFrame()
        {

            frameOn = true;
            frameJustEnded = false;

            _cpu.FindNextEvent();
            do
            {
                _cpu.Step();
            } while (frameOn);
            _totalCPUClocks = _cpu.Clock;
            //lock (_sharedWave)
            //{
            //    soundBopper.FlushFrame(_totalCPUClocks);
            //    soundBopper.EndFrame(_totalCPUClocks);
            //}

            if (PadOne != null) PadOne.Refresh();

            _totalCPUClocks = 0;
            _cpu.Clock = 0;
            _ppu.LastcpuClock = 0;


        }


        void FrameFinished()
        {
            frameJustEnded = true;
            frameOn = false;
            Drawscreen(this, new EventArgs());
        }
    }
}
