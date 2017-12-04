import { Component, Input } from "@angular/core";
import { NESService } from "../../../services/NESService";

@Component({
    selector: 'debug-cpustatus',
    template: `<span>PC: {{ cpuStatus?.PC.toString(16) }} A: {{ cpuStatus?.A.toString(16) }} X: {{ cpuStatus?.X.toString(16) }} Y: {{ cpuStatus?.Y.toString(16) }} SP: {{ cpuStatus?.SP.toString(16) }}</span>
    SR: {{ cpuStatus?.decodedStatusRegister }}`
})
export class CpuStatusComponent {
    @Input('cpuStatus') cpuStatus;
    constructor(private nes: NESService) {
        this.cpuStatus = nes.wishbone.cpuStatus;
    }
}
