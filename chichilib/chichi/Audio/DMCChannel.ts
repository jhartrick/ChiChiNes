import { Blip } from "./CommonAudio";
import { ChiChiCPPU } from "../ChiChiMachine";

export class DMCChannel  {
    time: number;
    internalClock: number = 0;
    fetching: boolean = false;
    buffer: number = 0;
    bufempty: boolean = false;
    outbits: number = 0;
    freqTable = [
        0x1AC,0x17C,0x154,0x140,0x11E,0x0FE,0x0E2,0x0D6,
        0x0BE,0x0A0,0x08E,0x080,0x06A,0x054,0x048,0x036,
    ];

    shiftreg: number= 0;
    silenced: boolean = false;
    cycles: number = 0;
    curAddr: number = 0;
    lengthCtr: number = 0;
    length: number = 0;
    addr: number = 0;
    pos: number = 0;
    pcmdata: number = 0;
    doirq: number = 0;
    frequency: number= 0;
    wavehold: number= 0;
    _chan: number= 0;
    delta = 0;

    private _bleeper: Blip = null;
    
    constructor(bleeper: Blip, chan: number, private cpu: ChiChiCPPU) {
        this._bleeper = bleeper;
        this._chan = chan;
    }

    WriteRegister(register: number, data: number, time: number): void {
        switch (register)
        {
        case 0:	this.frequency = data & 0xF;
            this.wavehold = (data >> 6) & 0x1;
            this.doirq = data >> 7;
            if (!this.doirq) {
                //CPU::WantIRQ &= ~IRQ_DPCM;
            }
            break;
        case 1:	
            this.pcmdata = data & 0x7F;
            this.pos = (this.pcmdata - 0x40) * 3;
            break;
        case 2:	
            this.addr = data;
            break;
        case 3:	
            this.length = data;
            break;
        case 4:	if (data)
            {
                if (!this.lengthCtr)
                {
                    this.curAddr = 0xC000 | (this.addr << 6);
                    this.lengthCtr = (this.length << 4) + 1;
                }
            }
            else	
            { 
                this.lengthCtr = 0;
            }
            // CPU::WantIRQ &= ~IRQ_DPCM;
            break;
        }
    }

    Run(end_time: number): void {
        // this uses pre-decrement due to the lookup table
        for (; this.time < end_time; this.time ++) {
            if (!--this.cycles)
            {
                this.cycles = this.freqTable[this.frequency];
                if (!this.silenced)
                {
                    if (this.shiftreg & 1)
                    {
                        if (this.pcmdata <= 0x7D)
                        this.pcmdata += 2;
                    }
                    else
                    {
                        if (this.pcmdata >= 0x02)
                        this.pcmdata -= 2;
                    }
                    this.shiftreg >>= 1;
                    this.pos = (this.pcmdata - 0x40) * 3;
                }
                if (!--this.outbits)
                {
                    this.outbits = 8;
                    if (!this.bufempty)
                    {
                        this.shiftreg = this.buffer;
                        this.bufempty = true;
                        this.silenced = false;
                    }
                    else 
                    {
                        this.silenced = true;
                    }
                }
            }
            if (this.bufempty && !this.fetching && this.lengthCtr && (this.internalClock & 1))
            {
                this.fetching = true;
                //CPU::EnableDMA |= DMA_PCM;
                // decrement LengthCtr now, so $4015 reads are updated in time
                this.lengthCtr--;
            }

        }

    }


    fetch () : void {
        this.buffer = this.cpu.GetByte(this.curAddr);
        this.bufempty = false;
        this.fetching = false;
        if (++this.curAddr == 0x10000)
            this.curAddr = 0x8000;
        if (!this.lengthCtr)
        {
            if (this.wavehold)
            {
                this.curAddr = 0xC000 | (this.addr << 6);
                this.lengthCtr = (this.length << 4) + 1;
            }
            else if (this.doirq) {
                this.cpu._handleIRQ = true;
            }
        }
    }

    UpdateAmplitude(new_amp: number): void {

    }

    EndFrame(time: number): void {

        
    }

    FrameClock(time: number, step: number): void {
  
    }


}