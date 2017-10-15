using System;
using ChiChiNES.BeepsBoops;

namespace ChiChiNES
{
    public partial class NESMachine
    {
        private CPU2A03 _cpu;

        public CPU2A03 Cpu
        {
            get { return _cpu; }
            set { _cpu = value; }
        }
        private CPU2A03 _ppu;
        private INESCart _cart;

        public INESCart Cart
        {
            get { return _cart; }
        }

        //public void WriteWAVToFile(IWavWriter writer)
        //{
        //    _sharedWave.AppendFile(writer);
        //}

        //public void StopWritingWAV()
        //{
        //    _sharedWave.AppendFile(null);
        //}

        WavSharer _sharedWave;
        Bopper soundBopper;

        public Bopper SoundBopper
        {
            get { return soundBopper; }
            set { soundBopper = value; }
        }



        public IWavReader WaveForms
        {
            get { return _sharedWave; }
        }

        private bool _enableSound = true;

        public bool EnableSound
        {
            get { return _enableSound; }
            set {

                if (_enableSound != value)
                {
                    soundBopper.Muted = !value;
                    _enableSound = value;
                }
            }
        }

        public void SetupSound()
        {
            _sharedWave = new WavSharer();
            //writer = new wavwriter(44100, "d:\\nesout.wav");
            soundBopper = new Bopper(_sharedWave);
        }


        bool breakpointHit = false;

        //TileDoodler tiler;

        //public TileDoodler Tiler
        //{
        //    get { return tiler; }
        //}
        
        ///SoundThreader soundThreader;
        bool doDraw = false;
        //zzzz bloop;
        public NESMachine(CPU2A03 cpu, WavSharer wavSharer, Bopper soundBopper)
        {

            //machineWorkQueue = new MachineQueue(UpdateQueue);

            _cpu = cpu;
            _ppu = cpu;
            
            _ppu.PPU_FrameFinishHandler = new MachineEvent(FrameFinished);
            //this.tiler = tiler;

            _sharedWave = wavSharer;
            this.soundBopper = soundBopper;
            _cpu.SoundBopper = soundBopper;

           // soundThreader = soundThread;

            Initialize();
        }
        

        public int FrameCount
        {
            get { return frameCount; }
            set { frameCount = value; }
        }

        public event EventHandler Drawscreen;
        
        public bool IsRunning
        {
            get { return true; }
        }

        public IControlPad PadOne
        {
            get { return _cpu.PadOne.ControlPad; }
            set { _cpu.PadOne.ControlPad = value; }
        }

        public IControlPad PadTwo
        {
            get { return _cpu.PadTwo.ControlPad; }
            set { _cpu.PadTwo.ControlPad = value;
                  //  PPU.PixelAwareDevice = value as IPixelAwareDevice;
            }
        }
        

    }
}
