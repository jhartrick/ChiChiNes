export interface _Cartridge {
    system: string;
    crc: string;
    sha1: string;
    dump: string;
    dumper: string;
    datedumped: string;
}
export interface Cartridge {
    $: _Cartridge;
    board: Board[];
    game: Game[];
}
export interface _Board {
    type: string;
    pcb: string;
    mapper: string;
}
export interface Board {
    $: _Board;
    prg?: Prg[];
    chr?: Chr[];
    vram?: Vram[];
    wram?: Wram[];
    chip?: Chip[];
    cic?: any[];
}
export interface _Prg {
    name: string;
    size: string;
    crc: string;
    sha1: string;
}
export interface Prg {
    $: _Prg;
}
export interface _Chr {
    name: string;
    size: string;
    crc: string;
    sha1: string;
}
export interface Chr {
    $: _Chr;
}
export interface _Vram {
    size: string;
}
export interface Vram {
    $: _Vram;
}
export interface _Wram {
    size: string;
    battery: string;
}
export interface Wram {
    $: _Wram;
}
export interface _Chip {
    type: string;
}
export interface Chip {
    $: _Chip;
}
export interface _Game {
    name: string;
    altname: string;
    class: string;
    subclass: string;
    catalog: string;
    publisher: string;
    developer: string;
    region: string;
    players: string;
    date: string;
}
export interface Game {
    $: _Game;
}
export interface CartridgeInfo {
    cartridge: Cartridge;
}
