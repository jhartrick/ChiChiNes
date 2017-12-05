import { Component, Input } from "@angular/core";
import { NESService } from "../../../services/NESService";
import { WishboneMachine } from "../../../services/wishbone/wishbone";
import { CpuStatus } from "chichi";

@Component({
    selector: 'debug-cpustatus',
    template: `<span>PC: {{ cpuStatus?.PC.toString(16) }} A: {{ cpuStatus?.A.toString(16) }} X: {{ cpuStatus?.X.toString(16) }} Y: {{ cpuStatus?.Y.toString(16) }} SP: {{ cpuStatus?.SP.toString(16) }}</span>`
})
export class CpuStatusComponent {
    //SR: {{ cpuStatus?.decodedStatusRegister }}
    cpuStatus: CpuStatus;
    constructor(public wishbone: WishboneMachine) {
        this.cpuStatus = wishbone.Cpu.GetStatus();

        wishbone.asObservable().subscribe(()=>{
            this.cpuStatus = wishbone.Cpu.GetStatus();
        });
    }
}
