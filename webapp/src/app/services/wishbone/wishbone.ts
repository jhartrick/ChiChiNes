class WishboneCPPU  {
    Clock: number;
    frameFinished: () => void;
    byteOutBuffer: Uint8Array;
    CurrentInstruction: ChiChiNES.CPU2A03.Instruction;
    SoundBopper: ChiChiNES.BeepsBoops.Bopper;
    PadOne: ChiChiNES.InputHandler;
    PadTwo: ChiChiNES.InputHandler;
    Cart: ChiChiNES.IClockedMemoryMappedIOElement;
    Debugging: boolean;
    InstructionHistoryPointer: number;
    InstructionHistory: ChiChiNES.CPU2A03.Instruction[];
    CurrentFrame: any;
    ChrRomHandler: ChiChiNES.INESCart;
    SpritesOnLine: any;
    LastcpuClock: number;

    GetFlag(flag: number): boolean {
        throw new Error('Method not implemented.');
    }

    InterruptRequest() {
        throw new Error('Method not implemented.');
    }
    NonMaskableInterrupt() {
        throw new Error('Method not implemented.');
    }
    CheckEvent() {
        throw new Error('Method not implemented.');
    }
    RunFast() {
        throw new Error('Method not implemented.');
    }
    Step() {
        throw new Error('Method not implemented.');
    }
    ResetCPU() {
        throw new Error('Method not implemented.');
    }
    PowerOn() {
        throw new Error('Method not implemented.');
    }
    RunFrame() {
        throw new Error('Method not implemented.');
    }
    DecodeAddress() : number {
        throw new Error('Method not implemented.');
    }
    HandleBadOperation() {
        throw new Error('Method not implemented.');
    }
    DecodeOperand() : number {
        throw new Error('Method not implemented.');
    }
    Execute() {
        throw new Error('Method not implemented.');
    }
    SetZNFlags(data: number) {
        throw new Error('Method not implemented.');
    }

    Compare(data: number) {
        throw new Error('Method not implemented.');
    }
    Branch() {
        throw new Error('Method not implemented.');
    }
    NMIHandler() {
        throw new Error('Method not implemented.');
    }
    IRQUpdater() {
        throw new Error('Method not implemented.');
    }
    LoadBytes(offset: number, bytes: any) {
        throw new Error('Method not implemented.');
    }
    LoadBytes$1(offset: number, bytes: any, length: number)  {
        throw new Error('Method not implemented.');
    }
    PeekByte(address: number) : number {
        throw new Error('Method not implemented.');
    }
    PeekBytes(start: number, finish: number) {
        throw new Error('Method not implemented.');
    }
    FindNextEvent(): void {
        throw new Error('Method not implemented.');
    }
    HandleNextEvent() {
        throw new Error('Method not implemented.');
    }
    ResetInstructionHistory() {
        throw new Error('Method not implemented.');
    }
    WriteInstructionHistoryAndUsage() {
        throw new Error('Method not implemented.');
    }
    FireDebugEvent(s: string) {
        throw new Error('Method not implemented.');
    }
    PeekInstruction(address: number) {
        throw new Error('Method not implemented.');
    }
    PPU_Initialize() {
        throw new Error('Method not implemented.');
    }
    PPU_SetupVINT() {
        throw new Error('Method not implemented.');
    }
    PPU_VidRAM_GetNTByte(address: number) {
        throw new Error('Method not implemented.');
    }
    UpdatePPUControlByte0() {
        throw new Error('Method not implemented.');
    }

    PPU_SetByte(Clock: number, address: number, data: number) {
        throw new Error('Method not implemented.');
    }

    PPU_GetByte(Clock: number, address: number) {
        throw new Error('Method not implemented.');
    }

    PPU_HandleEvent(Clock: number) {
        throw new Error('Method not implemented.');
    }

    PPU_ResetClock(Clock: number) {
        throw new Error('Method not implemented.');
    }

    PPU_CopySprites(copyFrom: number) {
        throw new Error('Method not implemented.');
    }
    PPU_InitSprites() {
        throw new Error('Method not implemented.');
    }
    PPU_GetSpritePixel() {
        throw new Error('Method not implemented.');
    }
    PPU_WhissaSpritePixel(patternTableIndex: number, x: number, y: number, sprite: { v: ChiChiNES.NESSprite; }, tileIndex: number): number {
        throw new Error('Method not implemented.');
    }
    PPU_PreloadSprites(scanline: number) {
        throw new Error('Method not implemented.');
    }
    PPU_UnpackSprites() {
        throw new Error('Method not implemented.');
    }
    UnpackSprite(currSprite: number) {
        throw new Error('Method not implemented.');
    }
    PPU_GetNameTablePixel() : number {
        return 0;
    }

    FetchNextTile() {
        throw new Error('Method not implemented.');
    }
    GetAttributeTableEntry(ppuNameTableMemoryStart: number, i: number, j: number): number{
        return 0;
    }
    DrawTo(cpuClockNum: number): void {
    }

    UpdatePixelInfo() {
    }

}