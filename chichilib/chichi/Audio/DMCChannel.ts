import { Blip } from "./CommonAudio";
import { ChiChiCPPU } from "../ChiChiCPU";

export class DMCChannel  {
    directLoad: boolean = false;
    amplitude: number = 0;
    time: number = 0;
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
    loopFlag: number= 0;
    _chan: number= 0;
    delta = 0;
    gain = 503;

    interruptRaised = false;

    private bleeper: Blip = null;
    
    constructor(bleeper: Blip, chan: number, doDma: (address: number) => number) {
        this.bleeper = bleeper;
        this._chan = chan;
        this.handleDma = (address) => {
            return doDma(address)
        }
       

    }

    handleIrq(): void {
        this.interruptRaised = true;
    }

    handleDma(address: number): number {
        return 0;
    }

    WriteRegister(register: number, data: number, time: number): void {
        switch (register)
        {
        case 0:	
            this.frequency = data & 0xf;
            this.loopFlag = (data >> 6) & 0x1;
            this.doirq = (data >> 7) & 1;
            if (this.doirq === 0) {
                this.interruptRaised = false;
            }
            break;
        case 1:	
            this.pcmdata = data & 0x7f;
            this.updateAmplitude(this.pcmdata);
            break;
        case 2:	
            this.addr = data;
            break;
        case 3:	
            this.length = data;
            // if (!this.lengthCtr)
            //     this.lengthCtr = this.length;
            break;
        case 4:
            this.interruptRaised = false;
        	if (data)
            {
                if (!this.lengthCtr)
                {
                    this.curAddr = 0xC000 | ((this.addr << 6) & 0xffff);
                    this.lengthCtr = (this.length << 4) + 1;
                }
            }
            else	
            { 
                this.lengthCtr = 0;
                
            }

            break;
        }
    }

    updateAmplitude(new_amp: number): void {

        const delta = new_amp * this.gain - this.amplitude;
        this.amplitude += delta;
        this.bleeper.blip_add_delta(this.time, delta);
    }


    Run(end_time: number): void {


        
        for (; this.time < end_time; this.time ++) {
                
            if (--this.cycles <= 0)
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
                    this.updateAmplitude(this.pcmdata);
                }
                if (--this.outbits <= 0)
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
            if (this.bufempty && !this.fetching && this.lengthCtr )
            {
                this.fetching = true;
                this.fetch();
                this.lengthCtr--;
                
            }
        }

    }


    fetch () : void {
        this.buffer = this.handleDma(this.curAddr);
        this.bufempty = false;
        this.fetching = false;
        if (++this.curAddr == 0x10000)
            this.curAddr = 0x8000;

        if (!this.lengthCtr)
        {
            if (this.loopFlag)
            {
                this.curAddr = 0xC000 | ((this.addr << 6) & 0xffff);
                this.lengthCtr = (this.length << 4) + 1;
            }
            else if (this.doirq) {
                this.handleIrq();
            }
        }
    }

    EndFrame(time: number): void {
        this.Run(time);
        this.time = 0;
    }

    FrameClock(time: number, step: number): void {
        this.Run(time);
    }


}