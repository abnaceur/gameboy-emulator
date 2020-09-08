import { GBMasterClass } from "./gbMaster.model";

export class GameBoy {

    activeDebuger: boolean = false;
    isDefaultLoaded: boolean = false;
    options;

    GBMaster: GBMasterClass;
    sadGB = "data:image/gif;base64,R0lGODlhGQArAIAAAP///wAAACH5BAAHAP8ALAAAAAAZACsAAAKORI6pewYPo5yvGYZRDTf721Gi1mjiRHKmKrFhaTkolIYOF7m1eeawTaugfjwarkWM9Taq5pGpfDlzSGMTeMLtor2tJwNSUI5i2BcD6pwTmyG4ulxy43D6iPy0xaj9iLuVdQSlFY4FrWXN1NnN9R493gY6Xg4JaSlKHdjqCfDl7X5CYqZqeck6IYKxUBRAAA7";

    RSToff = 0; //used by gbs player
    paused = false;
    filename;
    game;
    ctx;
    colours = [[219, 255, 134, 255], [194, 226, 33, 255], [73, 156, 27, 255], [15, 86, 47, 255]]
    file;
    gameLoaded = false;
    biosLoaded = 0;
    GBAudioContext = null;
    stereo = true;
    NoAudioAPI = false
    getGamepads = navigator.getGamepads;


    internalCanvas;
    internalCtx;
    canvas

    constructor(file, canvas, options) {
        if (options == null)
            this.options = { rootDir: "" }
        else
            this.options = options;

        if (typeof this.GBMaster == "undefined") this.GBMaster = new GBMasterClass();

        this.internalCanvas = document.createElement("canvas");
        this.internalCanvas.width = 160;
        this.internalCanvas.height = 144;
        this.internalCtx = this.internalCanvas.getContext("2d");

        if (canvas == null) canvas = this.internalCanvas; //if we have no output, display to self.
        this.canvas = canvas; //output canvas
        var ctx = canvas.getContext("2d");

        if (typeof ctx.webkitImageSmoothingEnabled != "undefined") {
            ctx.webkitImageSmoothingEnabled = false;
        } else if (typeof ctx.imageSmoothingEnabled != "undefined") {
            ctx.imageSmoothingEnabled = false;
        } else {
            console.log("imageSmoothingEnabled not supported, falling back to css scaling")
            canvas.style.width = canvas.width + "px";
            canvas.style.height = canvas.height + "px";
            canvas.width = 160;
            canvas.height = 144;
        }


        if (typeof AudioContext !== 'undefined') {
            this.GBAudioContext = new AudioContext();
        } else {
            this.NoAudioAPI = true;
        }

        if (this.NoAudioAPI) {
            //audio api is so integrated that i have to make all nodes dummy objects to keep things functioning
            //since the AudioEngine objects are still used in audio emulation (which is still needed)
            //please forgive me for this hacky disaster

            this.GBAudioContext = {
                createGain: function () { return { gain: { value: 0 }, connect: function () { } } },
                createChannelMerger: function (a) { return { connect: function () { } } },
                createScriptProcessor: function (a, b, c) { return { connect: function () { } } },
                sampleRate: 0 //this will make cyclesForSample equal infinity, and no audio will ever be produced. ;)
            }
        }

        window.addEventListener('touchstart', this.dummySound.bind(this), false);
        window.addEventListener('mousedown', this.dummySound.bind(this), false);
    }


    dummySound() {
        if (this.GBAudioContext.resume != null) this.GBAudioContext.resume();
        var buffer = this.GBAudioContext.createBuffer(1, 1, 22050);
        var source = this.GBAudioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.GBAudioContext.destination);
        source.start(0);
    }

    loadROM(url, pauseAfter) {
        var loadfile = new XMLHttpRequest();
        loadfile.open("GET", url);
        loadfile.responseType = "arraybuffer";
        loadfile.send();

        var filename = url.split("/");
        this.filename = filename[filename.length - 1];
        this.paused = true;

        loadfile.onreadystatechange = function () { this.mime = this.getResponseHeader('content-type'); }.bind(this);

        loadfile.onload = function () {
            this.paused = (pauseAfter || false);
            this.loadROMBuffer(loadfile.response);
        }.bind(this)
        loadfile.onerror = function () {
            alert("Failed to load " + url + "! Are CORS requests enabled on the server?")
        }
    }

    loadROMBuffer(buffer) {
        if (buffer instanceof ArrayBuffer) this.game = new Uint8Array(buffer);
        else if (buffer instanceof Uint8Array) this.game = buffer;
        else alert(buffer);
        this.gameLoaded = true;
        if (this.biosLoaded == 2) this.init();
    }

    scopeEval(code) { return eval(code) }

    registers;
    flags;
    SP;
    PC;
    Cycles;
    IME;
    bios;
    CGBbios;
    MemRead;
    MemWrite;
    VRAM;
    RAM;
    OAM;
    IORAM;
    ZRAM;
    CRAM;
    biosActive;
    vblankComplete;
    lineCycles;
    GBScreen;
    buttonByte;
    masterClock;
    frameskip;
    timeStart;
    sampleNumber;
    MBC;
    MBCReadHandler;
    MBCWriteHandler;
    AudioEngine;
    AudioMerge;
    soundLout;
    soundRout;
    audioSampleRate;
    LCDstate;
    halted;
    palettes;
    palettesInt32;
    ROMID;
    timerCounts;
    WaveRAMCycles;
    CGB;
    CGBDMA;
    CPUSpeed;
    CGBBGPal;
    CGBBGPalReg;
    CGBSprPal;
    CGBSprPalReg;
    tileLayerData = new Uint8Array(160);
    tileLayerPalette = new Uint8Array(160);
    emptyTileLayer = new Uint8Array(160);
    bufferSize;
    audioSyncFrames;
    soundCycles;
    soundPhase;
    timerCycles;
    audioCycles;
    cyclesForSample;
    divCounts;
    CGBInt32BG;
    CGBInt32Spr


}
