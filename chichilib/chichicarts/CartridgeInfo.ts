export interface _Cartridge {
    system: string;
    crc: string; 
    sha1: string; 
    dump: string;
    dumper: string; 
    datedumped: string;
}

export interface Cartridge {
    $ : _Cartridge;
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

// var x: CartridgeInfo = {
//     cartridge: { $: { system:"NES-NTSC", 
//                         crc:"9EDD2159", 
//                         sha1: "FA189FC0F9277D5765E5DE19274AFBD28660F076", 
//                         dump:"ok", 
//                         dumper:"bootgod",
//                         datedumped:"2006-11-05"
//                     }
//                 ,   
//                 board: [ { $:{ type: "NES-AOROM", pcb: "NES-AOROM-03", mapper: "7"},
//                             prg:[ { $: { 
//                                 name:"NES-R2-0 PRG",
//                                 size:"256k",
//                                 crc:"9EDD2159",
//                                 sha1:"FA189FC0F9277D5765E5DE19274AFBD28660F076"}
//                             }],
//                             vram:[{$:{"size":"8k"}}],
//                             chip:[{"$":{"type":"74xx161"}}],
//                             cic:[{$:{"type":"6113B1"}}],
//                             chr:[{"$":{"name":"NES-FA-0 CHR","size":"256k","crc":"7344D52A","sha1":"4FC5B2331DCA300BF75D0A6C3996602B6DDA7191"}}]
//                     }],
//                 game:[
//                     { $: 
//                         {name:"R.C. Pro-Am II",
//                         altname:"",
//                         class:"Licensed",
//                         subclass:"",
//                         catalog:"NES-R2-USA",
//                         publisher:"Tradewest",
//                         developer:"Rare",
//                         region:"USA",
//                         players:"4",
//                         date:"1992-12"}
//                     }
//                 ]
//             }}