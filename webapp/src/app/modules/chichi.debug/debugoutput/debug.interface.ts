import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import { ChiChiInstruction, ChiChiCPPU_AddressingModes, DebugHelpers } from 'chichi';
import { WishboneMachine } from '../../../services/wishbone/wishbone';

interface IDecodedInstruction extends ChiChiInstruction {
    asm: string;
}

export class DecodedInstruction implements IDecodedInstruction {
    asm = 'none';
    AddressingMode = 0;
    frame = 0;
    time = 0;
    A = 0;
    X = 0;
    Y = 0;
    SR = 0;
    SP = 0;
    Address = 0;
    OpCode = 0;
    Parameters0 = 0;
    Parameters1 = 0;
    ExtraTiming = 0;
    Length = 0;

    constructor(inst: ChiChiInstruction) {
        if (inst) {
            this.frame = inst.frame;
            this.A = inst.A;
            this.X = inst.X;
            this.Y = inst.Y;
            this.SR = inst.SR;
            this.SP = inst.SP;
            this.Address = inst.Address;
            this.OpCode = inst.OpCode;
            this.Parameters0 = inst.Parameters0;
            this.Parameters1 = inst.Parameters1;
            this.ExtraTiming = inst.ExtraTiming;
            this.Length = inst.Length;
            this.asm = DebugHelpers.disassemble(inst);
        }
    }

}

export class DebugEventInfo {
    eventType: string;
    public instruction?: DecodedInstruction[];
}

export class InstructionHistoryDatabase {
    private bufData: DecodedInstruction[] = new Array<DecodedInstruction>();
    /** Stream that emits whenever the data has been modified. */
    dataChange: BehaviorSubject<DecodedInstruction[]> = new BehaviorSubject<DecodedInstruction[]>([]);
    get data(): DecodedInstruction[] { return this.dataChange.value; }
    length = 0;

    constructor() {
    }

    addInstructions(inst: DecodedInstruction[]) {
        this.bufData = inst.concat(this.bufData);
        this.length = this.bufData.length;
    }

    addInstruction(inst: DecodedInstruction) {
        this.bufData.push(inst);
        this.length = this.bufData.length;
    }

    update() {
        const copiedData = this.bufData;
        this.length = copiedData.length;
        this.dataChange.next(copiedData);
        this.bufData = new Array<DecodedInstruction>();
    }
}

export class DebugInstructionDataSource extends DataSource<any> {
    _filterChange = new BehaviorSubject('');
    get filter(): string { return this._filterChange.value; }
    set filter(filter: string) { this._filterChange.next(filter); }


    length: number;

    constructor(private _exampleDatabase: InstructionHistoryDatabase, private _paginator: MatPaginator) {
        super();
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<DecodedInstruction[]> {
        const displayDataChanges = [
            this._exampleDatabase.dataChange,
            this._paginator.page,
        ];

        return Observable.merge(...displayDataChanges).map(() => {
            const data = this._exampleDatabase.data.slice();
            // Grab the page's slice of data.
            const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
            return data.splice(startIndex, this._paginator.pageSize);
        });

        // return this._exampleDatabase.dataChange;
    }

    disconnect() { }
}

export class Debugger {
    static SRMasks_CarryMask = 0x01;
    static SRMasks_ZeroResultMask = 0x02;
    static SRMasks_InterruptDisableMask = 0x04;
    static SRMasks_DecimalModeMask = 0x08;
    static SRMasks_BreakCommandMask = 0x10;
    static SRMasks_ExpansionMask = 0x20;
    static SRMasks_OverflowMask = 0x40;
    static SRMasks_NegativeResultMask = 0x80;


    currentPPUStatus: any;
    constructor(private machine: WishboneMachine) {
        this.machine.debugEvents.subscribe((data) => this.processData(data));
    }

    private processData(debug: any)  {

        if (debug.InstructionHistory) {
            this.setInstructionPage(debug.InstructionHistory);
            if (debug.InstructionHistory.Finish) {
                this.lastInstructions.update();
            }
        }
    }

    public lastInstructions: InstructionHistoryDatabase = new InstructionHistoryDatabase();

    public decodedStatusRegister = '';

    static decodeCpuStatusRegister(sr: number): string {
        let result = '';
        result += ' N:' + (sr & Debugger.SRMasks_NegativeResultMask ? '1' : '0');
        result += ' O:' + (sr & Debugger.SRMasks_OverflowMask ? '1' : '0');
        result += ' E:' + (sr & Debugger.SRMasks_ExpansionMask ? '1' : '0');
        result += ' B:' + (sr & Debugger.SRMasks_BreakCommandMask ? '1' : '0');
        result += ' D:' + (sr & Debugger.SRMasks_DecimalModeMask ? '1' : '0');
        result += ' I:' + (sr & Debugger.SRMasks_InterruptDisableMask ? '1' : '0');
        result += ' Z:' + (sr & Debugger.SRMasks_ZeroResultMask ? '1' : '0');
        result += ' C:' + (sr & Debugger.SRMasks_CarryMask ? '1' : '0');
        return result;
    }

    private setInstructionPage(instHist: any): void {
        const start = instHist.Index & 0xff;
        const inst = instHist.Buffer;

        const curPos: number = start + 1;

        const newInstructions: DecodedInstruction[] = new Array<DecodedInstruction>();

        for (let j = 0; j < inst.length; ++j) {
            const i = (curPos + j) & 0xFF;
            const instr = new DecodedInstruction(inst[i]);

            if (instr.asm !== 'none') {
                newInstructions.push(instr);
            }
        }

        this.lastInstructions.addInstructions(newInstructions);
    }
}
