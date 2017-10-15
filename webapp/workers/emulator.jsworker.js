﻿//require('bridge.min.js');
//require('ChiChiCore.min.js');
importScripts('http://localhost:802/workers/bridge.min.js');
importScripts('http://localhost:802/workers/ChiChiCore.min.js');

(function (globals, tendo) {
    var cartName = '';

    var runStatuses = {
        Off: 0,
        Running: 1,
        Paused: 2,
        DebugRunning: 3,
        Stepping : 4
    }

    tendo.controlPad1 = {
      currentByte:  0,
      readNumber:  0,
      padOneState: 0,
      CurrentByte: 0,

      padValues: 
          {
              A: 1,
              B: 2,
              Select: 4,
              Start: 8,

              Up: 16,
              Down: 32,
              Left: 64,
              Right: 128

          },


      ChiChiNES$IControlPad$refresh: function(){
          this.refresh();
      },

      refresh: function(){
      },

      ChiChiNES$IControlPad$getByte: function(clock) {
          return this.getByte(clock);
      },

      getByte: function(clock) {
          var result = (this.currentByte >> this.readNumber) & 0x01;
          this.readNumber = (this.readNumber + 1) & 7;
          return (result | 0x40) & 0xFF;
      },

      ChiChiNES$IControlPad$setByte: function (clock, data) {
          this.setByte(clock, data);
      },

      setByte: function(clock, data) {
            if((data & 1) == 1) {
                this.currentByte = this.padOneState;
            // if im pushing up, i cant be pushing down
                if ((this.currentByte & 16) == 16) this.currentByte = this.currentByte & ~32;
            // if im pushign left, i cant be pushing right.. seriously, the nes will glitch
                if ((this.currentByte & 64) == 64) this.currentByte = this.currentByte & ~128;
            readNumber = 0;
        }
      },

      dispose: () => { }
    }

    function createMachine() {
        const wavsharer = new ChiChiNES.BeepsBoops.WavSharer();

        const soundbop = new ChiChiNES.BeepsBoops.Bopper(wavsharer);
        const cpu = new ChiChiNES.CPU2A03(soundbop);
        cpu.PPU_FillRGB = false;
        tendo.machine = new ChiChiNES.NESMachine(cpu,
            wavsharer,
            soundbop);
        tendo.machine.PadOne = tendo.controlPad1;//this.controlPad;
        //this.tileDoodler = new Tiler(this.machine);
        tendo.machine.Drawscreen = () => {
          // globals.postMessage({ frame: true, fps: framesPerSecond });
        };
        this.ready = true;
        tendo.machine.Cpu.FireDebugEvent = () => {
            updateState();
        };
        tendo.machine.Cpu.Debugging = false;
        //
    }

    var intervalId;
    var framesPerSecond = 0;

    function stop() {
        clearInterval(intervalId);
        tendo.machine.PowerOff();
    }

    function flushAudio() {
      //  debugger;
        const len = tendo.machine.WaveForms.SharedBufferLength / 2;
        for (let i = 0; i < len; ++i) {
            if (tendo.sharedAudioBufferPos + i > tendo.sharedAudioBuffer.length) {
                tendo.sharedAudioBufferPos = 0;
                this.iops[0] = 0;
                Atomics.wait(this.iops, 0, 0);
                return;
            }
            tendo.sharedAudioBuffer[tendo.sharedAudioBufferPos + i] = tendo.machine.WaveForms.SharedBuffer[i];
        }
        tendo.sharedAudioBufferPos += len;


    }

    function run(reset) {
        var framesRendered = 0;
        var startTime = new Date().getTime();
        const machine = tendo.machine;    

        if (reset) {
            machine.PowerOn();
        }
        runStatus = runStatuses.Running;

        machine.Cpu.Debugging = false;
        clearInterval(tendo.interval);
        // intervalId = setInterval(() => 
        tendo.interval = this.setInterval(() => {
            tendo.controlPad1.padOneState = this.iops[2];
            machine.RunFrame();
            framesPerSecond = 0;

            if (!tendo.soundEnabled) flushAudio();
            if ((framesRendered++ & 0x2F) === 0x2F) {
                framesPerSecond = ((framesRendered / (new Date().getTime() - startTime)) * 1000);
                framesRendered = 0; startTime = new Date().getTime();
                this.iops[1] = framesPerSecond;
                //globals.postMessage({ frame: true, fps: framesPerSecond });
            }
        }, 0);
    }

    function runFrame() {
        clearInterval(tendo.interval);
        tendo.frameFinished = false;
        const machine = tendo.machine;
        machine.Cpu.Debugging = tendo.Debugging;
        runStatus = runStatuses.DebugRunning;
        // intervalId = setInterval(() => 
        machine.RunFrame();
        framesPerSecond = 0;
        tendo.frameFinished = true;

    }

    function step() {
        clearInterval(tendo.interval);
        tendo.frameFinished = false;
        const machine = tendo.machine;
        machine.Cpu.Debugging = tendo.Debugging;
        runStatus = runStatuses.DebugRunning;
        // intervalId = setInterval(() => 
        machine.Step();
        framesPerSecond = 0;
        tendo.frameFinished = true;

    }

    function reset() {
        tendo.machine.Reset();
    }

    var runStatus = runStatuses.Off;

    function updateState() {
        const machine = tendo.machine;    

        var info = {
            stateupdate: true,
            runStatus: runStatus
        };
        if (machine && machine.Cart) {
            info.cartInfo = {
                mapperId: machine.Cart.MapperID,
                name: cartName,
                prgRomCount: machine.Cart.NumberOfPrgRoms,
                chrRomCount: machine.Cart.NumberOfChrRoms
            };
        }
        if (machine) {
            info.sound = {
                soundEnabled: machine.EnableSound
            };
            if (tendo.Debugging) {
                info.debug = {
                    currentCpuStatus: {
                        PC: tendo.machine.Cpu.ProgramCounter,
                        A: tendo.machine.Cpu.Accumulator,
                        X: tendo.machine.Cpu.IndexRegisterX,
                        Y: tendo.machine.Cpu.IndexRegisterY,
                        SP: tendo.machine.Cpu.StackPointer,
                        SR: tendo.machine.Cpu.StatusRegister
                    }, InstructionHistory: {
                        Buffer: tendo.machine.Cpu.InstructionHistory.slice(0),
                        Index: tendo.machine.Cpu.InstructionHistoryPointer,
                        Finish : tendo.frameFinished
                    }

                };
            }
        }
        
        postMessage(info);
    }

    var iops = [0, 0, 0];

    this.onmessage = (event) => {
        let machine = tendo.machine;    
        tendo.Debugging = false;
        tendo.frameFinished = false;

        switch (event.data.command) {
          case 'create':
                createMachine();
                break;
          case 'setiops':
                this.iops = event.data.iops;
              break;
          case 'loadrom':
                stop();
                machine.LoadCart(event.data.rom);
                cartName = event.data.name;
              break;
          case 'setvbuffer':
                tendo.machine.Cpu.ByteOutBuffer = event.data.vbuffer;
              break;
          case 'setaudiobuffer':
                tendo.sharedAudioBuffer = event.data.audiobuffer;
                tendo.sharedAudioBufferPos = 0;
                break;
          case 'mute':
             //   debugger;
              tendo.soundEnabled = false;
              tendo.machine.EnableSound = false;
              break;
          case 'unmute':
             //   debugger;
              tendo.soundEnabled = true;
              tendo.machine.EnableSound = true;
              break;

          case 'run':
                run(true);
                break;
          case 'runframe':
              tendo.Debugging = true;
              runFrame(true);
              break;
          case 'step':
              tendo.Debugging = true;
              step(true);
              break;
          case 'continue':
              run(false);
              break;
          case 'stop':
              stop();
              break;
          case 'reset':
              reset();
              break;
          case 'setpad':
              controlPad1.padOneState = event.data.padOneState;
              break;
          default:
              postMessage('unknown command: ' + event.data.command);
              return;
        }
        updateState();

    }

})(this, {});
