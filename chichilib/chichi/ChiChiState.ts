import { IChiChiPPUState } from "./ChiChiPPU";
import { IChiChiCPPUState } from "./ChiChiCPU";
import { IChiChiAPUState } from "./ChiChiAudio";
import { IBaseCartState } from "../chichicarts/BaseCart";
import { ChiChiMachine } from "./ChiChiMachine";

export class ChiChiState {
    ppu: IChiChiPPUState;
    cpu: IChiChiCPPUState;
    apu: IChiChiAPUState;
    cart: IBaseCartState;


}

export class ChiChiStateManager {
    read (machine: ChiChiMachine): ChiChiState {
        const state = new ChiChiState();
        state.apu = machine.SoundBopper.state;
        state.ppu = machine.ppu.state;
        state.cart = machine.Cart.state;
        state.cpu = machine.Cpu.state;
        return state;
    }

    write(machine: ChiChiMachine, value: ChiChiState) {
        if (value.ppu) {
            machine.ppu.state = value.ppu;
        }
        if (value.apu) {
            machine.SoundBopper.state = value.apu;
        }
        if (value.cart) {
            machine.Cart.state = value.cart;
        }
        if (value.cpu) {
            machine.Cpu.state = value.cpu;
        }
        
    }
}