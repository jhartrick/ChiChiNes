import './../src/app/emu/bridge.js';
import './../src/app/emu/ChiChiCore.js';

onmessage = (event:MessageEvent) => {
    setTimeout(() => {
        let p = new bgEmu();
        postMessage('hello there');
    }, 1000);
 }

 export class bgEmu {
    // public tileDoodler: Tiler;
    // private machine: ChiChiNES.NESMachine;
    // public controlPad: ControlPad;


    constructor() {
        // const wavsharer = new ChiChiNES.BeepsBoops.WavSharer();
        // const whizzler = new ChiChiNES.PixelWhizzler();
        // whizzler.FillRGB = false;

        // const soundbop = new ChiChiNES.BeepsBoops.Bopper(wavsharer);
        // const cpu = new ChiChiNES.CPU2A03(whizzler, soundbop);
        // this.controlPad = new ControlPad();
        // this.machine = new ChiChiNES.NESMachine(cpu, whizzler, new ChiChiNES.TileDoodler(whizzler), wavsharer, soundbop, new ChiChiNES.Sound.SoundThreader(null));
        // machine.PadOne = this.controlPad;
        // this.tileDoodler = new Tiler(this.machine);
        // machine.Cpu.Debugging = false;
    }
}