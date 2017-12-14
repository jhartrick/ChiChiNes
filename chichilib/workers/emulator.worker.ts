
declare var Atomics: any;
import { WorkerInterop } from '../chichi/worker/worker.interop';
import {  RunningStatuses, DebugStepTypes } from '../chichi/ChiChiTypes';
import { ChiChiMachine } from '../chichi/ChiChiMachine';
import { MemoryPatch } from '../chichi/ChiChiCheats';
import { ChiChiStateManager, ChiChiState } from '../chichi/ChiChiState'; 

import * as CCMessage from '../chichi/worker/worker.message';
import { StateBuffer, StateBufferConfig } from '../chichi/StateBuffer';


class NesInfo {
    stateBuffer: StateBufferConfig;
    bufferupdate = false;
    stateupdate = true;
    machine: any = {};
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

class CommandHandler<T extends CCMessage.WorkerMessage> {
    static bind<X extends CCMessage.WorkerMessage>(command: string, handler: (val:X) => any): CommandHandler<X> {
        return new CommandHandler<X>(command, handler);
    }

    constructor(public command: string, private handler: (val:T) => any) {

    }
    process(command: T): CCMessage.WorkerResponse {   
        try {
            const cmdResp = this.handler(command);
            if (cmdResp) {
                return cmdResp;
            }
            return new CCMessage.WorkerResponse(command, true);
            
        } catch (e) {
            return new CCMessage.WorkerResponse(command, false, e.toString());
        }
    }
}



export class tendoWrapper {
    stateBuffer: StateBuffer;
    

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

    commands: Array<CommandHandler<any>> = [
        CommandHandler.bind<CCMessage.CreateCommand>(
        CCMessage.CMD_CREATE, 
        (val) => { 
            return this.createMachine(val); 
        }),
   

    CommandHandler.bind<CCMessage.LoadRomCommand>(
        CCMessage.CMD_LOADROM, 
        (val) => { 
            return this.loadCart(val); 
        }) ,
   

    CommandHandler.bind<CCMessage.CheatCommand>(
        CCMessage.CMD_CHEAT, 
        (val) => { 
            return this.cheat(val); 
        }),
           

    CommandHandler.bind<CCMessage.AudioCommand>(
        CCMessage.CMD_AUDIOSETTINGS, 
        (val) => { 
            this.applyAudioSettings(val); 
        }),
   

    CommandHandler.bind<CCMessage.RunStatusCommand>(
        CCMessage.CMD_RUNSTATUS, 
        (val) => { 
            this.changeRunStatus(val); 
        }),
   

    CommandHandler.bind<CCMessage.DebugCommand>(
        CCMessage.CMD_DEBUGSTEP, 
        (val) => { 
            this.Debugging = true;
            switch (val.stepType)
            {
                case DebugStepTypes.Frame:
                    this.debugRunFrame();

                break;
                case DebugStepTypes.Instruction:
                    this.debugRunStep();
                break;
            }
        }),
    CommandHandler.bind<CCMessage.ResetCommand>(
        CCMessage.CMD_RESET, 
        (val) => { 
            this.machine.Reset();
        })];

    constructor() {
        this.machine = new ChiChiMachine();
        this.interop = new WorkerInterop(new Int32Array(<any>(new SharedArrayBuffer(16 * Int32Array.BYTES_PER_ELEMENT))));
    }

    createMachine(message: CCMessage.CreateCommand): CCMessage.WorkerResponse {
        this.machine = new ChiChiMachine();

        this.machine.Cpu.ppu.byteOutBuffer = this.buffers.vbuffer = message.vbuffer;
        this.machine.SoundBopper.writer.SharedBuffer = this.buffers.abuffer = message.abuffer;
        this.interop = new WorkerInterop(message.iops);            

        this.machine.SoundBopper.audioSettings = message.audioSettings;

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

        return new CCMessage.WorkerResponse(message, true);
    }

    updateBuffers() {
        const machine = this.machine;
        
        let info = new NesInfo();
        info.bufferupdate = true;
        info.stateupdate = false;
        if (this.machine) {
            info.stateBuffer = this.machine.StateBuffer.data;


            info.sound = {
                waveForms_controlBuffer: this.machine.WaveForms.controlBuffer
            }
        }

        postMessage(info);
    }

    updateState() {
        const machine : ChiChiMachine = this.machine;    
        if (this.stateBuffer) {
            this.stateBuffer.updateBuffer();
        }

        let info = new NesInfo();

        if (this.machine ) {
            info.machine = {
                runStatus: this.runStatus
            }

            if (machine.SoundBopper && machine.SoundBopper.audioSettings){
                info.sound = {
                    soundEnabled: machine.EnableSound,
                    settings: machine.SoundBopper.audioSettings
                };
            }
            if (this.machine.Cpu.Debugging) {
                info.debug = {
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

    changeRunStatus(data: CCMessage.RunStatusCommand) {
        clearInterval(this.interval);
        switch (data.status) {
            case RunningStatuses.Off:
                this.stop();
                break;
            case RunningStatuses.Running:
                if (this.runStatus === RunningStatuses.Paused) {
                    this.run(false);
                } else {
                    this.run(true);
                }
                break;
            case RunningStatuses.Paused:
                break;
            case RunningStatuses.Unloaded:
                this.stop();
                break;
        }
        
        this.runStatus = data.status;
    }

    private runInnerLoop() {
        this.machine.PadOne.padOneState = this.interop.controlPad0; // [this.interop.NES_CONTROL_PAD_0] & 0xFF;
        this.machine.PadTwo.padOneState = this.interop.controlPad1; // [this.interop.NES_CONTROL_PAD_1] & 0xFF;

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

          clearInterval(this.interval);
          this.interval = setInterval(() => {
            machine.Cpu.Debugging = false;
            machine.WaveForms.audioBytesWritten = 0;
            machine.WaveForms.sharedAudioBufferPos = 0;
            this.startTime = new Date().getTime();

            this.interop.loop();
            while(this.interop.looping) {  
                this.runInnerLoop();
            }
            },0);

          this.runStatus = machine.RunState;// runStatuses.Running;
      }
      
    debugRunFrame() {
        clearInterval(this.interval);
        this.frameFinished = false;
        const machine = this.machine;
        machine.Cpu.Debugging = this.Debugging;
        // intervalId = setInterval(() => 
        machine.RunFrame();
        this.runStatus = this.machine.RunState;
        this.frameFinished = true;

    }


    debugRunStep() {
        clearInterval(this.interval);
        const machine = this.machine;
        machine.Cpu.Debugging = this.Debugging;
        machine.Step();
        this.runStatus = this.machine.RunState;
    }

    buffers: any = { 
        vbuffer: [],
        abuffer: [] 
    };

    // attach require.js "require" fn here in bootstrapper
    require: any = {};

    loadCart(cmd: CCMessage.LoadRomCommand): CCMessage.WorkerResponse {
        var loader: any;
        this.require(
            { 
                baseUrl: "./assets" 
            },['romloader.worker'], 
            (romloader: any) => {
                const machine = this.machine;
                const cart = romloader.loader.loadRom(cmd.rom, cmd.name);
                
                this.machine.Cpu.setupMemoryMap(cart);
                
                this.machine.RebuildStateBuffer();

                cart.installCart(this.machine.ppu, this.machine.Cpu);
                
                this.machine.Cpu.cheating = false;
                this.machine.Cpu.genieCodes = new Array<MemoryPatch>();
                

                this.updateBuffers();
                delete romloader.loader;
                this.require.undef('romloader.worker');
            });
        return new CCMessage.WorkerResponse(cmd, true);
    }

    cheat(data: CCMessage.CheatCommand): CCMessage.WorkerResponse {
        this.machine.Cpu.cheating = data.cheats.length > 0;
        this.machine.Cpu.genieCodes = data.cheats;
        return new CCMessage.WorkerResponse(data, true);
    }

    applyAudioSettings(data: CCMessage.AudioCommand) {
        this.machine.SoundBopper.audioSettings = data.audioSettings;
    }

    handleMessage(event: MessageEvent) {
        const handler = this.commands.find(c => c.command == event.data.command);
        if (handler) {
            const resp = handler.process(event.data);
            postMessage(resp);
            this.updateState();
            return;
        }

        let machine = this.machine;

        switch (event.data.command) {
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
    }
}
