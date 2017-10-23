import { ChiChiMachine } from './chichi/ChiChi.HWCore';
import { RunningStatuses } from './chichi/ChiChiTypes'

class NesInfo {
    stateupdate = true;
    runStatus: any = {};
    cartInfo: any = {};
    sound: any = {};
    Cpu: any = {}
    debug: any = {
        currentCpuStatus: {
            PC: 0,
            A: 0,
            X: 0,
            Y: 0,
            SP: 0,
            SR: 0
        }, 
        currentPPUStatus: {}
    };
}

export class tendoWrapper {
    framesRendered: number = 0;
    startTime: number = 0;
    runTimeout: number = 0;
    Debugging: boolean = false;
    frameFinished: boolean = false;
    ready: boolean = false;
    framesPerSecond: number = 0;
    interval: number;
    runStatus: RunningStatuses;
    iops = new Array(16);
    machine: ChiChiMachine;
    cartName: string = 'unk';

    sharedAudioBuffer: any; 
    sharedAudioBufferPos: number = 0;

    constructor() {
        this.machine = new ChiChiMachine();

    }

    createMachine() {

          this.machine = new ChiChiMachine();
          this.machine.Drawscreen = () => {
              // flush audio
              // globals.postMessage({ frame: true, fps: framesPerSecond });
          };
          this.ready = true;
          this.machine.Cpu.FireDebugEvent = () => {
              var info = new NesInfo(); 
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
                      Finish: false
                  }

              };
              postMessage(info);
              //this.updateState();
          };
          this.machine.Cpu.Debugging = false;
      }

    updateState() {
        const machine = this.machine;    

        let info = new NesInfo();

        if (this.machine && this.machine.Cart) {
            info.Cpu = {
                Rams: this.machine.Cpu.Rams
            }
            info.cartInfo = {
                mapperId: this.machine.Cart.MapperID,
                name: this.cartName,
                prgRomCount: this.machine.Cart.NumberOfPrgRoms,
                chrRomCount: this.machine.Cart.NumberOfChrRoms
            };
        }
        if (machine) {
            info.sound = {
                soundEnabled: machine.EnableSound,
                settings: machine.SoundBopper.audioSettings
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

    stop() {
        clearInterval(this.interval);
        this.machine.PowerOff();
        this.runStatus = this.machine.RunState;
    }

    private flushAudio() {
    //  debugger;
          const len = this.machine.WaveForms.SharedBufferLength / 2;
          for (let i = 0; i < len; ++i) {
              if (this.sharedAudioBufferPos + i > this.sharedAudioBuffer.length) {
                  this.sharedAudioBufferPos = 0;
                  this.iops[0] = 0;
                  //Atomics.wait(this.iops, 0, 0);
                  return;
              }
              this.sharedAudioBuffer[this.sharedAudioBufferPos + i] = this.machine.WaveForms.SharedBuffer[i];
          }
          this.sharedAudioBufferPos += len;


      }


    private runInnerLoop() {
            this.machine.RunFrame();
            this.machine.PadOne.padOneState = this.iops[2] & 0xFF;
            this.machine.PadTwo.padOneState = (this.iops[2] >> 8) & 0xFF;
            this.framesPerSecond = 0;

            this.flushAudio();
            if ((this.framesRendered++) === 60) {
                this.framesPerSecond = ((this.framesRendered / (new Date().getTime() - this.startTime)) * 1000);
                this.framesRendered = 0; this.startTime = new Date().getTime();
                this.iops[1] = this.framesPerSecond;

                if (this.framesPerSecond < 60 && this.runTimeout > 0) {
                    this.runTimeout--;
                } else if (this.runTimeout < 50) {
                    this.runTimeout++;
                }
            }
            if (this.iops[0] === 0) {
                this.runStatus = RunningStatuses.Paused;
            }
        //this.runInnerLoop();
        //setTimeout(() => { this.runInnerLoop(); }, this.runTimeout); 

    }

    run(reset: boolean) {
          var framesRendered = 0;
          const machine = this.machine;

          if (reset) {
              machine.Reset();
          }
          machine.Cpu.Debugging = false;
          this.startTime = new Date().getTime();
          clearInterval(this.interval);
          this.interval = setInterval(() => {
              this.runInnerLoop();
          }, 17);
          //while (this.runStatus === RunningStatuses.Running) {
          //  this.runInnerLoop();
          //}
          this.runStatus = machine.RunState;// runStatuses.Running;
      }

    runFrame() {
        clearInterval(this.interval);
        this.frameFinished = false;
        const machine = this.machine;
        machine.Cpu.Debugging = this.Debugging;
        // intervalId = setInterval(() => 
        machine.RunFrame();
        this.runStatus = this.machine.RunState;
        this.frameFinished = true;

    }

    reset() {
        const machine = this.machine;
        machine.Cpu.Debugging = this.Debugging;
        machine.Reset();
        this.runStatus = this.machine.RunState;
    }

    step() {
        clearInterval(this.interval);
        const machine = this.machine;
        machine.Cpu.Debugging = this.Debugging;
        machine.Step();
        this.runStatus = this.machine.RunState;
    }

    handleMessage(event: MessageEvent) {
        let machine = this.machine;

        switch (event.data.command) {
            case 'create':
                this.createMachine();
                this.machine.Cpu.byteOutBuffer = event.data.vbuffer;
                this.sharedAudioBuffer = event.data.abuffer;
                this.sharedAudioBufferPos = 0;
                this.iops = event.data.iops;
                break;
            case 'loadrom':
                this.machine.EnableSound = false;

                this.stop();
                this.machine.LoadCart(event.data.rom);
               break;
            case 'loadnsf':
                this.stop();
                this.machine.LoadNSF(event.data.rom);
                break;
            case 'audiosettings':
                this.machine.SoundBopper.audioSettings = event.data.settings;
                break;
            case 'mute':
                this.machine.EnableSound = false;
                break;
            case 'unmute':
                this.machine.EnableSound = true;
                break;
            case 'run':
                this.Debugging = false;
                this.run(true);
                break;
            case 'runframe':
                this.Debugging = true;
                this.runFrame();
                break;
            case 'step':
                this.Debugging = true;
                this.step();
                break;
            case 'continue':
                this.run(false);
                break;
            case 'stop':
                this.machine.EnableSound = false;

                this.stop();
                break;
            case 'reset':
                this.reset();
                break;
            default:
                return;
        }
       this.updateState();
    }
}
