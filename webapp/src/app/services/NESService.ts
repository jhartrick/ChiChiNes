import { Injectable, EventEmitter } from '@angular/core';

export class Debugger {
      
        public lastInstructions: string[]; 

        public setInstructions(inst : ChiChiNES.CPU2A03.Instruction[]) : void {
          this.lastInstructions = new Array<string>();
          for(var i=0;i<inst.length;++i)
          {
            this.lastInstructions.push(this.disassemble(inst[i]));
          }
        } 

        public getMnemnonic ( opcode: number ) : string { 
            switch (opcode)
            {
                case 0x80:
                case 0x82:
                case 0xC2:
                case 0xE2:
                case 0x04:
                case 0x14:
                case 0x34:
                case 0x44:
                case 0x54:
                case 0x64:
                case 0x74:
                case 0xD4:
                case 0xF4:
                    //SKB()
                case 0x0C:
                case 0x1C:
                case 0x3C:
                case 0x5C:
                case 0x7C:
                case 0xDC:
                case 0xFC:
                    //SKW';
                    //DecodeAddress';
                    return 'DOP';
                    
                case 0x69:
                case 0x65:
                case 0x75:
                case 0x6d:
                case 0x7d:
                case 0x79:
                case 0x61:
                case 0x71:
                    return 'ADC';
                    

                case 0x29:
                case 0x25:
                case 0x35:
                case 0x2d:
                case 0x3d:
                case 0x39:
                case 0x21:
                case 0x31:
                    return 'AND';
                    

                case 0x0a:
                case 0x06:
                case 0x16:
                case 0x0e:
                case 0x1e:
                    return 'ASL';
                    

                case 0x90:
                    return 'BCC';
                    

                case 0xb0:
                    return 'BCS';
                    

                case 0xf0:
                    return 'BEQ';
                    

                case 0x24:
                case 0x2c:
                    return 'BIT';
                    

                case 0x30:
                    return 'BMI';
                    

                case 0xd0:
                    return 'BNE';
                    

                case 0x10:
                    return 'BPL';
                    

                case 0x00:
                    return 'BRK';
                    

                case 0x50:
                    return 'BVC';
                    

                case 0x70:
                    return 'BVS';
                    

                case 0x18:
                    return 'CLC';
                    

                case 0xd8:
                    return 'CLD';
                    

                case 0x58:
                    return 'CLI';
                    

                case 0xb8:
                    return 'CLV';
                    

                case 0xc9:
                case 0xc5:
                case 0xd5:
                case 0xcd:
                case 0xdd:
                case 0xd9:
                case 0xc1:
                case 0xd1:
                    return 'CMP';
                    

                case 0xe0:
                case 0xe4:
                case 0xec:
                    return 'CPX';
                    

                case 0xc0:
                case 0xc4:
                case 0xcc:
                    return 'CPY';
                    

                case 0xc6:
                case 0xd6:
                case 0xce:
                case 0xde:
                    return 'DEC';
                    

                case 0xca:
                    return 'DEX';
                    

                case 0x88:
                    return 'DEY';
                    

                case 0x49:
                case 0x45:
                case 0x55:
                case 0x4d:
                case 0x5d:
                case 0x59:
                case 0x41:
                case 0x51:
                    return 'EOR';
                    

                case 0xe6:
                case 0xf6:
                case 0xee:
                case 0xfe:
                    return 'INC';
                    

                case 0xe8:
                    return 'INX';
                    

                case 0xc8:
                    return 'INY';
                    

                case 0x4c:
                case 0x6c:
                    return 'JMP';
                    

                case 0x20:
                    return 'JSR';
                    

                case 0xa9:
                case 0xa5:
                case 0xb5:
                case 0xad:
                case 0xbd:
                case 0xb9:
                case 0xa1:
                case 0xb1:
                    return 'LDA';
                    

                case 0xa2:
                case 0xa6:
                case 0xb6:
                case 0xae:
                case 0xbe:
                    return 'LDX';
                    

                case 0xa0:
                case 0xa4:
                case 0xb4:
                case 0xac:
                case 0xbc:
                    return 'LDY';
                    

                case 0x4a:
                case 0x46:
                case 0x56:
                case 0x4e:
                case 0x5e:
                    return 'LSR';
                    

                case 0xea:
                case 0x1a:
                case 0x3a:
                case 0x5a:
                case 0x7a:
                case 0xda:
                case 0xfa:
                //case 0x04:
                //case 0x14:
                //case 0x34:
                //case 0x44:
                //case 0x64:
                //case 0x80:
                //case 0x82:
                case 0x89:
                //case 0xc2:
                //case 0xd4:
                //case 0xe2:
                //case 0xf4:
                //case 0x0c:
                //case 0x1c:
                //case 0x3c:
                //case 0x5c:
                //case 0x7c:
                //case 0xdc:
                //case 0xfc:
                    return 'NOP';
                    

                case 0x09:
                case 0x05:
                case 0x15:
                case 0x0d:
                case 0x1d:
                case 0x19:
                case 0x01:
                case 0x11:
                    return 'ORA';
                    

                case 0x48:
                    return 'PHA';
                    

                case 0x08:
                    return 'PHP';
                    

                case 0x68:
                    return 'PLA';
                    

                case 0x28:
                    return 'PLP';
                    

                case 0x2a:
                case 0x26:
                case 0x36:
                case 0x2e:
                case 0x3e:
                    return 'ROL';
                    

                case 0x6a:
                case 0x66:
                case 0x76:
                case 0x6e:
                case 0x7e:
                    return 'ROR';
                    

                case 0x40:
                    return 'RTI';
                    

                case 0x60:
                    return 'RTS';
                    

                case 0xeb: // undocumented sbc immediate
                case 0xe9:
                case 0xe5:
                case 0xf5:
                case 0xed:
                case 0xfd:
                case 0xf9:
                case 0xe1:
                case 0xf1:
                    return 'SBC';
                    

                case 0x38:
                    return 'SEC';
                    

                case 0xf8:
                    return 'SED';
                    

                case 0x78:
                    return 'SEI';
                    

                case 0x85:
                case 0x95:
                case 0x8d:
                case 0x9d:
                case 0x99:
                case 0x81:
                case 0x91:
                    return 'STA';
                    

                case 0x86:
                case 0x96:
                case 0x8e:
                    return 'STX';
                    

                case 0x84:
                case 0x94:
                case 0x8c:
                    return 'STY';
                    

                case 0xaa:
                    return 'TAX';
                    

                case 0xa8:
                    return 'TAY';
                    

                case 0xba:
                    return 'TSX';
                    

                case 0x8a:
                    return 'TXA';
                    

                case 0x9a:
                    return 'TXS';
                    

                case 0x98:
                    return 'TYA';
                    
                    //undocumented opcodes
                case 0x0b:
                case 0x2b:
                    return 'AAC';
                    
                case 0x4b:
                    return 'ASR';
                    
                case 0x6b:
                    return 'ARR';
                    
                case 0xab:
                    return 'ATX';
                    
            }
        }

        public disassemble (inst : ChiChiNES.CPU2A03.Instruction): string
        {
            if (!inst) return;
            var parms : string = "";
            parms = parms + inst.Parameters0.toString(16);
            parms = parms + inst.Parameters1.toString(16);
            
            var AddressingModes = {
                Bullshit: 0,
                Implicit: 1,
                Accumulator: 2,
                Immediate: 3,
                ZeroPage: 4,
                ZeroPageX: 5,
                ZeroPageY: 6,
                Relative: 7,
                Absolute: 8,
                AbsoluteX: 9,
                AbsoluteY: 10,
                Indirect: 11,
                IndexedIndirect: 12,
                IndirectIndexed: 13,
                IndirectZeroPage: 14,
                IndirectAbsoluteX: 15
            }

            var result : string = inst.Address.toString(16) + ': ';
            switch (inst.AddressingMode)
            {
                case AddressingModes.Accumulator:
                    result += this.getMnemnonic(inst.OpCode);
                    break;
                case AddressingModes.Implicit:
                    result +=  this.getMnemnonic(inst.OpCode);
                    break;
                case AddressingModes.Immediate:
                    result += this.getMnemnonic(inst.OpCode) + ' #' + inst.Parameters0.toString(16);// string.Format("{0} #${1:x2}", , inst.Parameters0);
                    break;
                case AddressingModes.ZeroPage:
                    result +=  this.getMnemnonic(inst.OpCode) + ' ' + inst.Parameters0.toString(16);
                    break;
                case AddressingModes.ZeroPageX:
                    result += this.getMnemnonic(inst.OpCode) + ' ' + inst.Parameters0.toString(16) + ', X';
                    break;
                case AddressingModes.ZeroPageY:
                    result += this.getMnemnonic(inst.OpCode) + ' ' + inst.Parameters0.toString(16) + ', Y';
                    break;
                case AddressingModes.Relative:
                    if ((inst.Parameters0 & 128) == 128)
                    {
                        result += this.getMnemnonic(inst.OpCode) + ' *' + inst.Parameters0.toString(16) ;// string.Format("{0} *{1}", getMnemnonic(inst.OpCode), (byte)inst.Parameters0);
                    }
                    else
                    {
                        result += this.getMnemnonic(inst.OpCode) + ' *+' + inst.Parameters0.toString(16);
                    }
                    break;
                case AddressingModes.Absolute:
                    var addr = (inst.Parameters1 * 256 | inst.Parameters0) ;
                    result +=  this.getMnemnonic(inst.OpCode) + ' ' + addr.toString(16);
                    break;
                case AddressingModes.AbsoluteX:
                    var addr = (inst.Parameters1 * 256 | inst.Parameters0) ;
                    result += this.getMnemnonic(inst.OpCode) + ' ' + addr.toString(16) + ',X';
                    break;
                case AddressingModes.AbsoluteY:
                    var addr = (inst.Parameters1 * 256 | inst.Parameters0) ;
                    result += this.getMnemnonic(inst.OpCode) + ' ' + addr.toString(16) + ',Y';
                    break;
                case AddressingModes.Indirect:
                    var addr = (inst.Parameters1 * 256 | inst.Parameters0) ;
                    result += this.getMnemnonic(inst.OpCode) + ' (' + addr.toString(16) + ')';
                    break;
                case AddressingModes.IndexedIndirect:
                    result += this.getMnemnonic(inst.OpCode) + ' (' + inst.Parameters0.toString(16) + ', X)';
                    break;
                case AddressingModes.IndirectIndexed:
                    result += this.getMnemnonic(inst.OpCode) + ' (' + inst.Parameters0.toString(16) + ', Y)';
                    break;

            }
            return result;
        }

}

@Injectable()
export class ControlPad implements ChiChiNES.IControlPad {

    currentByte: number = 0;
    readNumber: number = 0;
    padOneState: number = 0;
    CurrentByte: number;

    ChiChiNES$IControlPad$refresh(): void {
        this.refresh();
    }

    refresh(): void {
    }

    ChiChiNES$IControlPad$getByte(clock: number): number {
        return this.getByte(clock);
    }

    getByte(clock: number): number {
        var result = (this.currentByte >> this.readNumber) & 0x01;
        this.readNumber = (this.readNumber + 1) & 7;
        return (result | 0x40) & 0xFF;
    }

    ChiChiNES$IControlPad$setByte(clock: number, data: number): void {
        this.setByte(clock, data);
    }

    setByte(clock: number, data: number): void {
        if ((data & 1) == 1) {
            this.currentByte = this.padOneState;
            // if im pushing up, i cant be pushing down
            if ((this.currentByte & 16) == 16) this.currentByte = this.currentByte & ~32;
            // if im pushign left, i cant be pushing right.. seriously, the nes will glitch
            if ((this.currentByte & 64) == 64) this.currentByte = this.currentByte & ~128;
            this.readNumber = 0;
        }
    }

    dispose(): void {
    }
}

export class DebugEventInfo {
    eventType: string;
    public instruction?: ChiChiNES.CPU2A03.Instruction[];
}

@Injectable()
export class Emulator {
    private ready: boolean = false;
    public debugger: Debugger = new Debugger();
    private machine: ChiChiNES.NESMachine;
    private controlPad: ControlPad;
    private intervalId: NodeJS.Timer;
    private callback: () => void;
    public DebugUpdateEvent: EventEmitter<DebugEventInfo> = new EventEmitter<DebugEventInfo>();
      private padValues: any =
      {
          A: 1,
          B: 2,
          Select: 4,
          Start: 8,

          Up: 16,
          Down: 32,
          Left: 64,
          Right: 128,

          FullScreen: 256
      };

      constructor( ) {
          var wavsharer = new ChiChiNES.BeepsBoops.WavSharer();
          var whizzler = new ChiChiNES.PixelWhizzler();
          whizzler.FillRGB = false;

          var soundbop = new ChiChiNES.BeepsBoops.Bopper(wavsharer);
          var cpu = new ChiChiNES.CPU2A03(whizzler, soundbop);
          this.controlPad = new ControlPad();
        
          this.machine = new ChiChiNES.NESMachine(cpu, whizzler, new ChiChiNES.TileDoodler(whizzler), wavsharer, soundbop, new ChiChiNES.Sound.SoundThreader(null));
          this.machine.PadOne = this.controlPad;
          this.machine.Cpu.Debugging = false;
          this.machine.Cpu.FireDebugEvent = () => {
              this.debugger.setInstructions(this.machine.Cpu.InstructionHistory);

              this.DebugUpdateEvent.emit({ eventType: 'updateInstructionHistory' });
          }
      }

      get isDebugging(): boolean {
          return this.machine.Cpu.Debugging;
      }
      set isDebugging(value: boolean) {
          this.machine.Cpu.Debugging = value;
      }

      handleKeyDownEvent(event: KeyboardEvent) {
          switch (event.keyCode) {
              case 37: //left arrow
                  this.controlPad.padOneState |= 64 & 0xFF;
                  break;
              case 38: //up arrow	
                  this.controlPad.padOneState |= 16 & 0xFF;
                  break;
              case 39: //right arrow	39
                  this.controlPad.padOneState |= 128 & 0xFF;
                  break;
              case 40: //down arrow	40
                  this.controlPad.padOneState |= 32 & 0xFF;
                  break;
              case 90: //	z
                  this.controlPad.padOneState |= 2 & 0xFF;
                  break;
              case 88: //x
                  this.controlPad.padOneState |= 1 & 0xFF;
                  break;
              case 13: // enter
                  this.controlPad.padOneState |= 8 & 0xFF;
                  break;
              case 9: // tab
                  this.controlPad.padOneState |= 4 & 0xFF;
                  break;
          }
      }

      handleKeyUpEvent(event: KeyboardEvent) {
          switch (event.keyCode) {
              case 68: 
                  this.DebugUpdateEvent.emit({ eventType: 'showDebugger' });
                  break;
              case 37: //left arrow
                  this.controlPad.padOneState &=~64 & 0xFF;
                  break;
              case 38: //up arrow	
                  this.controlPad.padOneState &=~16 & 0xFF;
                  break;
              case 39: //right arrow	39
                  this.controlPad.padOneState &=~128 & 0xFF;
                  break;
              case 40: //down arrow	40
                  this.controlPad.padOneState &=~32 & 0xFF;
                  break;
              case 90: //	z
                  this.controlPad.padOneState &=~2 & 0xFF;
                  break;
              case 88: //x
                  this.controlPad.padOneState &=~1 & 0xFF;
                  break;
              case 13: // enter
                  this.controlPad.padOneState &=~8 & 0xFF;
                  break;
              case 9: // tab
                  this.controlPad.padOneState &=~4 & 0xFF;
                  break;
          }
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
        this.machine.Reset();
    }
    // control
    StartEmulator(): void {
        this.machine.PowerOn();
        var runNes = () => {
            clearInterval(this.intervalId);
            this.intervalId = setInterval(() => {
                this.machine.RunFrame();
            }, 0);
        };
        runNes();
    }

    StopEmulator(): void {
        clearInterval(this.intervalId);
        this.machine.PowerOff();
    }
    ResetEmulator(): void {
        this.machine.Reset();
    }
}