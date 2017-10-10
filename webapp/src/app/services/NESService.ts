import { Injectable, EventEmitter } from '@angular/core';
import { Debugger, DecodedInstruction, DebugEventInfo } from './debug.interface'; 
import { ControlPad } from './chichines.service.controlpad'; 

export class CartInfo {
    mapperId: number;
    name: string = '';
    prgRomCount : number = 0; 
    chrRomCount : number = 0; 
    constructor(nes: ChiChiNES.NESMachine) {  
      if (nes && nes.Cart) {
          this.mapperId = nes.Cart.MapperID;
          this.prgRomCount = nes.Cart.NumberOfPrgRoms;
          this.chrRomCount = nes.Cart.NumberOfChrRoms;
        }
    }
}

export enum RunStatus {
    Off,
    Running,
    Paused,
    DebugRunning,
    Stepping
}

export class CpuStatus {
    PC: number = 0;
    A: number = 0;
    X: number =0;
    Y: number =0;
    SP: number = 0;
    SR: number = 0;
}

export class Tiler {

    constructor(private nes: ChiChiNES.NESMachine) { }
    patternTables: Uint8ClampedArray[] = new Array<Uint8ClampedArray>(2);

    DoodleNameTable(nametable: number, outbuf:  Uint8ClampedArray ): void
    {
        //var data = new Uint32Array(this.nes.Tiler.DoodlePatternTable(0));
        var doodle1 = this.nes.Tiler.DoodleNameTable(nametable);
        var pal = ChiChiNES.PixelWhizzler.pal;

        for (var i = 0; i <= doodle1.length; ++i) {
            var color = pal[doodle1[i]];
            outbuf[i * 4] = (color >> 0) & 0xFF;
            outbuf[(i * 4) + 1] = (color >> 9) & 0xFF;
            outbuf[(i * 4) + 2] = (color >> 16 ) & 0xFF;
            outbuf[(i * 4) + 3] =  0xFF;
        }

        this.patternTables[1] = new Uint8ClampedArray(this.nes.Tiler.DoodlePatternTable(0x1000));
    }


}

@Injectable()
export class Emulator {
    public tileDoodler: Tiler;
    public currentCpuStatus: CpuStatus = {
        PC: 0,
        A: 0,
        X: 0,
        Y: 0,
        SP: 0,
        SR: 0
    }; 
    private ready: boolean = false;
    private machine: ChiChiNES.NESMachine;
    private intervalId: NodeJS.Timer;
    private callback: () => void;

    public runStatus: RunStatus = RunStatus.Off;
    public debugger: Debugger = new Debugger();
    public controlPad: ControlPad;
    public framesPerSecond: number = 0;

    public grabRam(start: number, finish: number): number[] {
        var length = finish - start;
        var r = this.machine.Cpu.PeekBytes(start, finish + 1);
        return r;
    }

    public DebugUpdateEvent: EventEmitter<DebugEventInfo> = new EventEmitter<DebugEventInfo>();

      constructor( ) {
          var wavsharer = new ChiChiNES.BeepsBoops.WavSharer();
          var whizzler = new ChiChiNES.PixelWhizzler();
          whizzler.FillRGB = false;
          
          var soundbop = new ChiChiNES.BeepsBoops.Bopper(wavsharer);
          var cpu = new ChiChiNES.CPU2A03(whizzler, soundbop);
          this.controlPad = new ControlPad();
          this.machine = new ChiChiNES.NESMachine(cpu, whizzler, new ChiChiNES.TileDoodler(whizzler), wavsharer, soundbop, new ChiChiNES.Sound.SoundThreader(null));
          this.machine.PadOne = this.controlPad;
          this.tileDoodler = new Tiler(this.machine);
          this.machine.Cpu.Debugging = false;
          this.machine.Cpu.FireDebugEvent = (event) => {
              this.debugger.setInstructions(this.machine.Cpu.InstructionHistory, this.machine.Cpu.InstructionHistoryPointer & 0xFF);
              // this.DebugUpdateEvent.emit({ eventType: 'machineDebugEvent' });
          }
          this.machine.Cpu.HandleBadOperation = () => {
              this.currentCpuStatus = {
                      PC: this.machine.Cpu.ProgramCounter,
                      A: this.machine.Cpu.Accumulator,
                      X: this.machine.Cpu.IndexRegisterX,
                      Y: this.machine.Cpu.IndexRegisterY,
                      SP: this.machine.Cpu.StackPointer,
                      SR: this.machine.Cpu.StatusRegister
                  };
              debugger;
              this.debugger.setInstructions(this.machine.Cpu.InstructionHistory, this.machine.Cpu.InstructionHistoryPointer & 0xFF);
              this.DebugUpdateEvent.emit({ eventType: 'badOperation' });
          }


      }

      get cartInfo() : CartInfo {
        return new CartInfo(this.machine);
      }

      get isDebugging(): boolean {
          return this.machine.Cpu.Debugging;
      }

    IsRunning(): boolean {
        return this.machine.IsRunning;
    }
    
    public wavBuffer: any;
    
    public fillWavBuffer() : void {
      // This gives us the actual ArrayBuffer that contains the data
      var nowBuffering = this.wavBuffer.getChannelData(0);
      for (var i = 0; i < this.machine.WaveForms.SharedBufferLength; i+=2) {
        // Math.random() is in [0; 1.0]
        // audio needs to be in [-1.0; 1.0]

        var buf = new ArrayBuffer(4);
        var view = new DataView(buf);
        view.setUint8(0,this.machine.WaveForms.SharedBuffer[i]);
        view.setUint8(0,this.machine.WaveForms.SharedBuffer[i+1]);
        //view.setUint8(0,this.machine.WaveForms.SharedBuffer[i+2]);
        //view.setUint8(0,this.machine.WaveForms.SharedBuffer[i+3]);
        nowBuffering[i/2] = view.getFloat32(0) ;
      }
      this.machine.WaveForms.ReadWaves();

       //this.machine.WaveForms.SharedBuffer
    }

    // platform hooks
    SetCallbackFunction(callback: () => void ) {
        this.machine.addDrawscreen(callback);
        this.ready = true;
    }

    SetVideoBuffer(array: Uint8Array): void {
        this.machine.PPU.ByteOutBuffer = array;

    }

    SetDebugCallbackFunction(callback: () => void) {
        //this.machine.addDebugCallback(callback);

    }

    // rom loading
    LoadRom(rom: number[]) {
        this.machine.LoadCart(rom);
    }
    // control
    StartEmulator(): void {
        if (this.machine.Cart) {
            this.machine.Cpu.Debugging = false;

            this.machine.PowerOn();
            this.switchDebugMode(RunStatus.Running);

        }
    }


    private runFunction() : void {
        var framesRendered = 0;
        var startTime = new Date().getTime();
        this.machine.Cpu.Debugging = false;

        clearInterval(this.intervalId);
        this.intervalId = setInterval(() => {
            this.machine.RunFrame();
            
            if(framesRendered++ & 0x50) {
              this.framesPerSecond = ((framesRendered / (new Date().getTime() - startTime)) * 1000) >>>0;
              framesRendered = 0; startTime = new Date().getTime();
            } 
        }, 0);
    }

    private runDebugFunction() : void {
          this.machine.Cpu.Debugging = true;
          this.intervalId = setTimeout(() => {
              this.machine.RunFrame();
              this.debugger.setInstructions(this.machine.Cpu.InstructionHistory, this.machine.Cpu.InstructionHistoryPointer & 0xFF);
              this.machine.Cpu.ResetInstructionHistory();
              this.debugger.doUpdate();
              this.currentCpuStatus = {
                  PC: this.machine.Cpu.ProgramCounter,
                  A: this.machine.Cpu.Accumulator,
                  X: this.machine.Cpu.IndexRegisterX,
                  Y: this.machine.Cpu.IndexRegisterY,
                  SP: this.machine.Cpu.StackPointer,
                  SR: this.machine.Cpu.StatusRegister
              };
              this.DebugUpdateEvent.emit({ eventType: 'debugStepFrame' });
              //this.switchDebugMode(isdebugging: boolean)
          }, 0);
    }

    private runDebugStepFunction() : void {
          this.intervalId = setTimeout(() => {
              this.machine.Cpu.Debugging = true;
              this.machine.Step();

              this.debugger.setInstructions(this.machine.Cpu.InstructionHistory, this.machine.Cpu.InstructionHistoryPointer & 0xFF);
              this.debugger.doUpdate();
              this.currentCpuStatus = {
                  PC: this.machine.Cpu.ProgramCounter,
                  A: this.machine.Cpu.Accumulator,
                  X: this.machine.Cpu.IndexRegisterX,
                  Y: this.machine.Cpu.IndexRegisterY,
                  SP: this.machine.Cpu.StackPointer,
                  SR: this.machine.Cpu.StatusRegister
              };
              this.DebugUpdateEvent.emit({ eventType: 'debugStep' });
              //this.switchDebugMode(isdebugging: boolean)
          }, 0);
    }

    private switchDebugMode(newStatus: RunStatus): void {
        switch(this.runStatus) {
            case RunStatus.Stepping:
            case RunStatus.Paused:
            case RunStatus.Off:  // can move to any state safely
              this.runStatus = newStatus;
              break;
            case RunStatus.Running:
            case RunStatus.DebugRunning:
              clearInterval(this.intervalId);
              this.runStatus = newStatus;
              break;
        }
        switch (newStatus)
        {
            case RunStatus.Stepping:
              this.runDebugStepFunction();
              break;
            case RunStatus.Off:  // can move to any state safely
              this.machine.PowerOff();
              break;
            case RunStatus.Running:
              this.runFunction();
              break;
            case RunStatus.DebugRunning:
              this.runDebugFunction();
              break;
        }
    }

    get canStart() : boolean {
      return (this.machine.Cart) ? true: false;
    }

    StopEmulator(): void {
        this.switchDebugMode(RunStatus.Off);
    }

    ResetEmulator(): void {
        this.machine.Reset();
    }

    DebugStep() : void {
        this.switchDebugMode(RunStatus.Stepping);
    }

    DebugStepFrame() : void {
        this.switchDebugMode(RunStatus.DebugRunning);
    }

    Continue() : void {
        this.switchDebugMode(RunStatus.Running);
    }


}