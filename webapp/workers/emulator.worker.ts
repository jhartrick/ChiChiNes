//require('bridge.min.js');
//require('ChiChiCore.min.js');
//importScripts('http://192.168.56.103:801/workers/bridge.min.js')
//importScripts('http://192.168.56.103:801/workers/ChiChiCore.js');
//importScripts('http://192.168.56.103:801/workers/chichi/ChiChi.HWCore.js');
//importScripts('http://localhost:802/workers/bridge.min.js');
//importScripts('http://localhost:802/workers/ChiChiCore.js');
//importScripts('http://localhost:802/workers/chichi/ChiChi.HWCore.js');

class tendo  {
    machine: ChiChiMachine;
    cartName: string = 'unk';
    
    constructor() {
        this.machine = new ChiChiMachine();
        this.machine.Drawscreen = this.drawScreen;
        this.machine.Cpu.Debugging = false;
        this.machine.Cpu.FireDebugEvent = () => {
            this.updateState();
        };
    }
//Update State
    updateState() {
        const machine = this.machine;    

        var info = {
            stateupdate: true,
            runStatus: {},
            cartInfo: {},
            sound: {},
            debug: {}
        };

        if (this.machine && this.machine.Cart) {
            info.cartInfo = {
                mapperId: this.machine.Cart.MapperID,
                name: this.cartName,
                prgRomCount: this.machine.Cart.NumberOfPrgRoms,
                chrRomCount: this.machine.Cart.NumberOfChrRoms
            };
        }
        if (machine) {
            info.sound = {
                soundEnabled: machine.EnableSound
            };
            if (this.machine.Cpu.Debugging) {
                info.debug = {
                    currentCpuStatus: this.machine.Cpu.GetStatus ? this.machine.Cpu.GetStatus() : {
                        PC: 0,
                        A: 0,
                        X: 0,
                        Y: 0,
                        SP: 0,
                        SR: 0
                    },
                    currentPPUStatus: this.machine.Cpu.GetPPUStatus ? this.machine.Cpu.GetPPUStatus() : {},
                    InstructionHistory: {
                        Buffer: this.machine.Cpu.InstructionHistory.slice(0),
                        Index: this.machine.Cpu.InstructionHistoryPointer,
                        Finish : true
                    }

                };
            }
        }
        
        postMessage(info);
    }

    drawScreen() {}

    handleMessage () {}
}
/*
(function (globals, tendo) {
    var cartName = '';

    var runStatuses = {
        Off: 0,
        Running: 1,
        Paused: 2,
        DebugRunning: 3,
        Stepping : 4
    }


    function createMachine() {

        tendo.machine = new ChiChiMachine();
        tendo.machine.Drawscreen = () => {
            // flush audio
          // globals.postMessage({ frame: true, fps: framesPerSecond });
        };
        this.ready = true;
        tendo.machine.Cpu.FireDebugEvent = () => {
            updateState();
        };
        tendo.machine.Cpu.Debugging = false;
    }

    var intervalId;
    var framesPerSecond = 0;

    function stop() {
        clearInterval(tendo.intervalId);
        tendo.machine.PowerOff();
    }

    function flushAudio() {
      //  debugger;
        const len = tendo.machine.WaveForms.SharedBufferLength / 2;
        for (let i = 0; i < len; ++i) {
            if (tendo.sharedAudioBufferPos + i > tendo.sharedAudioBuffer.length) {
                tendo.sharedAudioBufferPos = 0;
                this.iops[0] = 0;
                //Atomics.wait(this.iops, 0, 0);
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
            tendo.machine.PadOne.padOneState = this.iops[2] & 0xFF;
            tendo.machine.PadTwo.padTwoState = (this.iops[2] >> 8) & 0xFF;
            machine.RunFrame();
            framesPerSecond = 0;

            flushAudio();


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
                    currentCpuStatus: tendo.machine.Cpu.GetStatus ? tendo.machine.Cpu.GetStatus() : {
                        PC: tendo.machine.Cpu.ProgramCounter,
                        A: tendo.machine.Cpu.Accumulator,
                        X: tendo.machine.Cpu.IndexRegisterX,
                        Y: tendo.machine.Cpu.IndexRegisterY,
                        SP: tendo.machine.Cpu.StackPointer,
                        SR: tendo.machine.Cpu.StatusRegister
                    },
                    currentPPUStatus: tendo.machine.Cpu.GetPPUStatus ? tendo.machine.Cpu.GetPPUStatus() : {},
                    InstructionHistory: {
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
                tendo.machine.Cpu.byteOutBuffer = event.data.vbuffer;
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
 */

