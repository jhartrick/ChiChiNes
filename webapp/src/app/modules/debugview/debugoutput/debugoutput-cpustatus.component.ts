import { Component, Input, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { WishboneMachine, WishboneCPPU } from '../../../services/wishbone/wishbone';

@Component({
    selector: 'debug-cpustatus',
    templateUrl: './debugoutput-cpustatus.component.html',
    // template: `<span>PC: {{ cpu.programCounter.toString(16) }} A: {{ cpu.accumulator.toString(16) }} X: {{ cpu.indexRegisterX.toString(16) }} Y: {{ cpu.indexRegisterY.toString(16) }} SP: {{ cpu.stackPointer.toString(16) }}</span>`
})
export class CpuStatusComponent {
    cpu: WishboneCPPU;
    constructor(public wishbone: WishboneMachine, private cd: ChangeDetectorRef, zone: NgZone ) {
        this.cpu = wishbone.Cpu;
        wishbone.Cpu.asObservable().subscribe((cpu) => {
            zone.run(() => {
                this.cpu = cpu;
                this.cd.detectChanges();
            });
        });
    }
}
