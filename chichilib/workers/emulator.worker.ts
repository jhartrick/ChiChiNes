declare var Atomics: any;
import { ChiChiMachine, RunningStatuses } from '../chichi/chichi'

class NesInfo {
    bufferupdate = false;
    stateupdate = true;
    runStatus: any = {};
    cartInfo: any = {};
    sound: any = {};
    Cpu: any = {};
    Cart: any = {};
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
    interval: any;
    runStatus: RunningStatuses;
    iops = new Int32Array(16);
    machine: ChiChiMachine;
    cartName: string = 'unk';

    sharedAudioBuffer: any; 
    sharedAudioBufferPos: number = 0;

    constructor() {
        this.machine = new ChiChiMachine();
    }

    createMachine() {
          this.machine = new ChiChiMachine();
          this.machine.Cpu.ppu.byteOutBuffer = this.buffers.vbuffer;
          this.machine.SoundBopper.writer.SharedBuffer = this.buffers.abuffer;
          this.machine.SoundBopper.audioSettings = this.buffers.audioSettings;

          this.machine.Drawscreen = () => {
              // flush audio
              // globals.postMessage({ frame: true, fps: framesPerSecond });
          };
          this.ready = true;
          this.machine.Cpu.addDebugEvent(() => {
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
                  currentPPUStatus: this.machine.ppu.GetPPUStatus ? this.machine.ppu.GetPPUStatus() : {},
                  InstructionHistory: {
                      Buffer: this.machine.Cpu.InstructionHistory.slice(0),
                      Index: this.machine.Cpu.InstructionHistoryPointer,
                      Finish: false
                  }

              };
              postMessage(info);
              //this.updateState();
          });
          this.machine.Cpu.Debugging = false;
      }

    updateBuffers() {
        const machine = this.machine;

        let info = new NesInfo();
        info.bufferupdate = true;
        info.stateupdate = false;
        if (this.machine && this.machine.Cart) {
            info.Cpu = {
                Rams: this.machine.Cpu.Rams,
                spriteRAM: this.machine.Cpu.ppu.spriteRAM
            }
            info.Cart = {
                //buffers
                chrRom: (<any>this.machine.Cart).chrRom,
                prgRomBank6: (<any>this.machine.Cart).prgRomBank6,
                ppuBankStarts: (<any>this.machine.Cart).ppuBankStarts,
                bankStartCache: (<any>this.machine.Cart).bankStartCache,
            }
            info.sound = {
                waveForms_controlBuffer: this.machine.WaveForms.controlBuffer
            }
        }

        postMessage(info);
    }

    updateState() {
        const machine : ChiChiMachine = this.machine;    

        let info = new NesInfo();

        if (this.machine && this.machine.Cart) {



            info.Cpu = {
                //Rams: this.machine.Cpu.Rams,
                status: this.machine.Cpu.GetStatus(),
                ppuStatus: this.machine.Cpu.ppu.GetPPUStatus(),
                backgroundPatternTableIndex: this.machine.Cpu.ppu.backgroundPatternTableIndex,
                _PPUControlByte0: this.machine.Cpu.ppu._PPUControlByte0,
                _PPUControlByte1:  this.machine.Cpu.ppu._PPUControlByte1
            }
            info.cartInfo = {
                mapperId: this.machine.Cart.MapperID,
                name: this.cartName,
                prgRomCount: this.machine.Cart.NumberOfPrgRoms,
                chrRomCount: this.machine.Cart.NumberOfChrRoms
            };
            info.Cart = {
                //buffers
                //chrRom: (<any>this.machine.Cart).chrRom,
                //prgRomBank6: (<any>this.machine.Cart).prgRomBank6,
                //ppuBankStarts: (<any>this.machine.Cart).ppuBankStarts,
                //bankStartCache: (<any>this.machine.Cart).bankStartCache,

                CurrentBank: (<any>this.machine.Cart).CurrentBank,
                // integers
                current8: (<any>this.machine.Cart).current8,
                currentA: (<any>this.machine.Cart).currentA,
                currentC: (<any>this.machine.Cart).currentC,
                currentE: (<any>this.machine.Cart).currentE,
                bank8start: (<any>this.machine.Cart).bank8start,
                bankAstart: (<any>this.machine.Cart).bankAstart,
                bankCstart: (<any>this.machine.Cart).bankCstart,
                bankEstart: (<any>this.machine.Cart).bankEstart
            }
        }

        if (machine) {
            if (machine.SoundBopper && machine.SoundBopper.audioSettings){
                info.sound = {
                    soundEnabled: machine.EnableSound,
                    settings: machine.SoundBopper.audioSettings
                };
            }
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
                    currentPPUStatus: this.machine.ppu.GetPPUStatus ? this.machine.ppu.GetPPUStatus() : {},
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
    audioBytesWritten : number = 0;

    private flushAudio() {
    //  debugger;
        const len = this.machine.WaveForms.SharedBufferLength;

        for (let i = 0; i < len; ++i) {
            this.sharedAudioBufferPos++;
            if (this.sharedAudioBufferPos >= this.sharedAudioBuffer.length) {
                this.sharedAudioBufferPos = 0;
            }
            this.sharedAudioBuffer[this.sharedAudioBufferPos ] = this.machine.WaveForms.SharedBuffer[i];
            this.audioBytesWritten++;
        }
        while (this.audioBytesWritten >= this.sharedAudioBuffer.length >> 2) {
            <any>Atomics.store(this.iops, 3, this.audioBytesWritten);
            <any>Atomics.wait(this.iops, 3, this.audioBytesWritten);
            this.audioBytesWritten = <any>Atomics.load(this.iops, 3);
        }

    }

    private runInnerLoop() {
        this.machine.PadOne.padOneState = this.iops[2] & 0xFF;
        this.machine.PadTwo.padOneState = (this.iops[2] >> 8) & 0xFF;

        this.machine.RunFrame();
        this.framesPerSecond = 0;

        //this.flushAudio();
        if ((this.framesRendered++) === 60) {
            // this.updateState();

            this.framesPerSecond = ((this.framesRendered / (new Date().getTime() - this.startTime)) * 1000);
            this.framesRendered = 0; this.startTime = new Date().getTime();
            this.iops[1] = this.framesPerSecond;

            // if (this.framesPerSecond < 60 && this.runTimeout > 0) {
            //     this.runTimeout--;
            // } else if (this.runTimeout < 50) {
            //     this.runTimeout++;
            // }
        }

        //this.runInnerLoop();
        //setTimeout(() => { this.runInnerLoop(); }, this.runTimeout); 

    }

    run(reset: boolean) {
        this.iops[3] = 12312312;
          var framesRendered = 0;
          const machine = this.machine;

          if (reset) {
              machine.Reset();
          }
          machine.Cpu.Debugging = false;
          this.startTime = new Date().getTime();
          clearInterval(this.interval);
          this.interval = setInterval(() => {
            this.iops[0]=1;
            while(this.iops[0]==1) {  
                this.runInnerLoop();
            }
          },1);

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
        //setTimeout(()=>{
        machine.Reset();
        //},16);
        this.runStatus = this.machine.RunState;
    }

    step() {
        clearInterval(this.interval);
        const machine = this.machine;
        machine.Cpu.Debugging = this.Debugging;
        machine.Step();
        this.runStatus = this.machine.RunState;
    }

    buffers: any = {};

    handleMessage(event: MessageEvent) {
        let machine = this.machine;

        switch (event.data.command) {
            case 'create':
            this.buffers = event.data;
                this.createMachine();
//                this.sharedAudioBufferPos = 0;
                this.iops = event.data.iops;
                break;
            case 'cheats':
                this.machine.Cpu.cheating = event.data.cheats.length > 0;
                this.machine.Cpu.genieCodes = event.data.cheats;
                break;                
            case 'loadrom':
                this.stop();
                this.machine = undefined;
                this.createMachine();
                this.machine.EnableSound = false;
                //this.createMachine();
                this.machine.LoadCart(event.data.rom);
                this.updateBuffers();
               break;
            case 'loadnsf':
                this.stop();
                //this.createNsfMachine();
                this.updateBuffers();

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
