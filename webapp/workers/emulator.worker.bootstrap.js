importScripts("./assets/require.js");
var self = this;
require({
    baseUrl: "./assets"
},
    ["require", "chichi/ChiChi.HWCore", "emulator.worker"],

    function (require, chichi, tendo) {
        var tend = new tendo.tendoWrapper();
        onmessage = (e) => {
            try {
                tend.handleMessage(e);
            } catch (error) {
                postMessage({ 'error': error } );
            }
        }
        postMessage('ready');
    }
);

//(function (globals, tendo, ChiChi) {
//    var cartName = '';
//    var runStatuses = {
//        Off: 0,
//        Running: 1,
//        Paused: 2,
//        DebugRunning: 3,
//        Stepping: 4
//    }

//    function createMachine() {

//        tendo.machine = new ChiChi.ChiChiMachine();
//        tendo.machine.Drawscreen = () => {
//            // flush audio
//            // globals.postMessage({ frame: true, fps: framesPerSecond });
//        };
//        this.ready = true;
//        tendo.machine.Cpu.FireDebugEvent = () => {
//            updateState();
//        };
//        tendo.machine.Cpu.Debugging = false;
//    }

//    //createMachine();
//    var intervalId;
//    var framesPerSecond = 0;

//    function stop() {
//        clearInterval(tendo.intervalId);
//        tendo.machine.PowerOff();
//    }

//    function flushAudio() {
//        //  debugger;
//        const len = tendo.machine.WaveForms.SharedBufferLength / 2;
//        for (let i = 0; i < len; ++i) {
//            if (tendo.sharedAudioBufferPos + i > tendo.sharedAudioBuffer.length) {
//                tendo.sharedAudioBufferPos = 0;
//                tendo.iops[0] = 0;
//                //Atomics.wait(tendo.iops, 0, 0);
//                return;
//            }
//            tendo.sharedAudioBuffer[tendo.sharedAudioBufferPos + i] = tendo.machine.WaveForms.SharedBuffer[i];
//        }
//        tendo.sharedAudioBufferPos += len;


//    }

//    function run(reset) {
//        var framesRendered = 0;
//        const machine = tendo.machine;

//        if (reset) {
//            machine.PowerOn();
//        }
//        runStatus = runStatuses.Running;

//        machine.Cpu.Debugging = false;
//        clearInterval(tendo.interval);
//        // intervalId = setInterval(() => 
//        var startTime = new Date().getTime();

//        tendo.interval = this.setInterval(() => {
//            tendo.machine.PadOne.padOneState = tendo.iops[2] & 0xFF;
//            tendo.machine.PadTwo.padTwoState = (tendo.iops[2] >> 8) & 0xFF;
//            machine.RunFrame();
//            framesPerSecond = 0;

//            flushAudio();

//            if ((framesRendered++ & 0x2F) === 0x2F) {
//                framesPerSecond = ((framesRendered / (new Date().getTime() - startTime)) * 1000);
//                framesRendered = 0; startTime = new Date().getTime();
//                tendo.iops[1] = framesPerSecond;
//                //globals.postMessage({ frame: true, fps: framesPerSecond });
//            }
//        }, 16
//        );
//    }

//    function runFrame() {
//        clearInterval(tendo.interval);
//        tendo.frameFinished = false;
//        const machine = tendo.machine;
//        machine.Cpu.Debugging = tendo.Debugging;
//        runStatus = runStatuses.DebugRunning;
//        // intervalId = setInterval(() => 
//        machine.RunFrame();
//        framesPerSecond = 0;
//        tendo.frameFinished = true;

//    }

//    function step() {
//        clearInterval(tendo.interval);
//        tendo.frameFinished = false;
//        const machine = tendo.machine;
//        machine.Cpu.Debugging = tendo.Debugging;
//        runStatus = runStatuses.DebugRunning;
//        // intervalId = setInterval(() => 
//        machine.Step();
//        framesPerSecond = 0;
//        tendo.frameFinished = true;

//    }

//    function reset() {
//        tendo.machine.Reset();
//    }

//    var runStatus = runStatuses.Off;

//    function updateState() {
//        const machine = tendo.machine;

//        var info = {
//            stateupdate: true,
//            runStatus: runStatus
//        };
//        if (machine && machine.Cart) {
//            info.cartInfo = {
//                mapperId: machine.Cart.MapperID,
//                name: cartName,
//                prgRomCount: machine.Cart.NumberOfPrgRoms,
//                chrRomCount: machine.Cart.NumberOfChrRoms
//            };
//        }
//        if (machine) {
//            info.sound = {
//                soundEnabled: machine.EnableSound
//            };
//            if (tendo.Debugging) {
//                info.debug = {
//                    currentCpuStatus: tendo.machine.Cpu.GetStatus ? tendo.machine.Cpu.GetStatus() : {
//                        PC: tendo.machine.Cpu.ProgramCounter,
//                        A: tendo.machine.Cpu.Accumulator,
//                        X: tendo.machine.Cpu.IndexRegisterX,
//                        Y: tendo.machine.Cpu.IndexRegisterY,
//                        SP: tendo.machine.Cpu.StackPointer,
//                        SR: tendo.machine.Cpu.StatusRegister
//                    },
//                    currentPPUStatus: tendo.machine.Cpu.GetPPUStatus ? tendo.machine.Cpu.GetPPUStatus() : {},
//                    InstructionHistory: {
//                        Buffer: tendo.machine.Cpu.InstructionHistory.slice(0),
//                        Index: tendo.machine.Cpu.InstructionHistoryPointer,
//                        Finish: tendo.frameFinished
//                    }

//                };
//            }
//        }

//        postMessage(info);
//    }

//    var iops = [0, 0, 0];

//    this.onmessage = (event) => {
//        let machine = tendo.machine;
//        tendo.Debugging = false;
//        tendo.frameFinished = false;

//        switch (event.data.command) {
//            case 'create':
//                createMachine();
//                tendo.machine.Cpu.byteOutBuffer = event.data.vbuffer;
//                tendo.sharedAudioBuffer = event.data.abuffer;
//                tendo.sharedAudioBufferPos = 0;
//                tendo.iops = event.data.iops;

//                break;
//            case 'loadrom':
//                stop();
//                clearInterval(tendo.intervalId);
//                machine.LoadCart(event.data.rom);
//                cartName = event.data.name;
//                break;
//            case 'mute':
//                //   debugger;
//                tendo.soundEnabled = false;
//                tendo.machine.EnableSound = false;
//                break;
//            case 'unmute':
//                //   debugger;
//                tendo.soundEnabled = true;
//                tendo.machine.EnableSound = true;
//                break;

//            case 'run':
//                run(true);
//                break;
//            case 'runframe':
//                tendo.Debugging = true;
//                runFrame(true);
//                break;
//            case 'step':
//                tendo.Debugging = true;
//                step(true);
//                break;
//            case 'continue':
//                run(false);
//                break;
//            case 'stop':
//                stop();
//                break;
//            case 'reset':
//                reset();
//                break;
//            case 'setpad':
//                controlPad1.padOneState = event.data.padOneState;
//                break;
//            default:
//                postMessage('unknown command: ' + event.data.command);
//                return;
//        }
//        updateState();

//    }

//})(self, {}, chichi);
//postMessage('ready');
//console.log(chichi);