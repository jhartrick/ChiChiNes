
declare var Atomics: any;
import { WorkerInterop } from './worker.interop';
import {  RunningStatuses } from '../chichi/ChiChiTypes';
import { ChiChiMachine } from '../chichi/ChiChiMachine';
import { MemoryPatch } from '../chichi/ChiChiCheats';
import { ChiChiStateManager, ChiChiState } from '../chichi/ChiChiState'; 

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
    interop: WorkerInterop;
    framesRendered: number = 0;
    startTime: number = 0;
    runTimeout: number = 0;
    Debugging: boolean = false;
    frameFinished: boolean = false;
    ready: boolean = false;
    framesPerSecond: number = 0;
    interval: any;
    runStatus: RunningStatuses;
    machine: ChiChiMachine;
    cartName: string = 'unk';

    sharedAudioBuffer: any; 
    sharedAudioBufferPos: number = 0;

    constructor() {
        this.machine = new ChiChiMachine();
        this.interop = new WorkerInterop(new Int32Array(<any>(new SharedArrayBuffer(16 * Int32Array.BYTES_PER_ELEMENT))));
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
                currentPPUStatus: this.machine.ppu.GetPPUStatus ? this.machine.ppu.GetPPUStatus() : {},
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

    private runInnerLoop() {
        this.machine.PadOne.padOneState = this.interop.controlPad0; // [this.interop.NES_CONTROL_PAD_0] & 0xFF;
        this.machine.PadOne.padOneState = this.interop.controlPad1; // [this.interop.NES_CONTROL_PAD_1] & 0xFF;

        this.machine.RunFrame();
        this.framesPerSecond = 0;

        if ((this.framesRendered++) === 60) {
            this.framesPerSecond = ((this.framesRendered / (new Date().getTime() - this.startTime)) * 1000);
            this.framesRendered = 0; this.startTime = new Date().getTime();
            this.interop.fps = this.framesPerSecond;

        }
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
            this.interop.loop();
            while(this.interop.looping) {  
                this.runInnerLoop();
            }
            },0);

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

    // attach require.js "require" fn here in bootstrapper
    require: any = {};

    loadCart(rom: number[], name: string) {
        var loader: any;
        this.require(
            { 
                baseUrl: "./assets" 
            },['romloader.worker'], 
            (romloader: any) => {
                const machine = this.machine;
                const cart = romloader.loader.loadRom(rom, name);
                cart.installCart(this.machine.ppu, this.machine.Cpu);
        
                machine.Cart.NMIHandler = () => { this.machine.Cpu._handleIRQ = true; };
                        
                this.machine.Cpu.cheating = false;
                this.machine.Cpu.genieCodes = new Array<MemoryPatch>();
            

                this.updateBuffers();
                delete romloader.loader;
                this.require.undef('romloader.worker');
                postMessage({ status: 'loaded' });
            });

    }

    handleMessage(event: MessageEvent) {
        let machine = this.machine;

        switch (event.data.command) {
            case 'create':
                this.buffers = event.data;
                this.createMachine();
//                this.sharedAudioBufferPos = 0;
                // this.iops = event.data.iops;
                this.interop = new WorkerInterop(event.data.iops);

                if (event.data.rom) {
                    this.loadCart(event.data.rom, event.data.name);
                }
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
                this.loadCart(event.data.rom, event.data.name);
                
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
                postMessage({ status: 'running' });
                break;
            case 'runframe':
                this.Debugging = true;
                this.runFrame();
                postMessage({ status: 'stopped' });
                break;
            case 'step':
                this.Debugging = true;
                this.step();
                postMessage({ status: 'stopped' });
                break;
            case 'continue':
                this.run(false);
                postMessage({ status: 'running' });
                break;
            case 'stop':
                this.machine.EnableSound = false;
                this.stop();
                postMessage({ status: 'stopped' });
                break;
            case 'reset':
                this.reset();
                break;

            case 'getstate':
                const state = new ChiChiStateManager().read(this.machine);
                postMessage( { state: state } );
                break;

            case 'setstate':
                new ChiChiStateManager().write(this.machine, <ChiChiState>event.data.state);
                break;
            default:
                return;
        }
       this.updateState();
    }
}
