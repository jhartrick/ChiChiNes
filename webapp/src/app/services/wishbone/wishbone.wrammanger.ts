import { ICartSettings } from "../ICartSettings";
import { NESService } from "../NESService";
import { WishboneMachine } from "./wishbone";
import { Injectable } from "@angular/core";
import { RunningStatuses } from "chichi";


export class WramManager {
    batteryBacked: boolean = false;
    crc: string;
    extension: string = '_wram';

    constructor (private wishbone: WishboneMachine) {
        this.wishbone.statusChanged.subscribe((status) => {
            switch(status) {
                case RunningStatuses.Running:
                    if (this.batteryBacked) {
                        this.restore();
                    }
                break;
                case RunningStatuses.Off:
                case RunningStatuses.Paused:
                    if (this.batteryBacked) {
                        this.save();
                    }
                break;
            }
        })
        this.crc = this.wishbone.Cart.realCart.ROMHashFunction;
        this.batteryBacked = this.wishbone.Cart.realCart.batterySRAM;
    }

    clear() {
        localStorage.setItem(this.crc + this.extension, undefined);
    }

    save() {
        const wishbone = this.wishbone;
        let item = wishbone.Cart.saveWram();
        localStorage.setItem(this.crc + this.extension, JSON.stringify(item));
    }        

    restore() {
        let item = localStorage.getItem(this.crc + this.extension);
        const wishbone = this.wishbone;
        if (item) {
            const wram = JSON.parse(item) 
            wishbone.Cart.restoreWram(wram);
        }
    }  
}