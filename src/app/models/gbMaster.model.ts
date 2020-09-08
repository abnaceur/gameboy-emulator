import { GameBoy } from "./gb.model";

export class GBMasterClass {

    requestAnimationFrame = window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.requestAnimationFrame;
    gameboys: GameBoy[] = [];

    constructor() { window.requestAnimationFrame(this.update); }

    update() {
        if (this.gameboys.length > 1) this.multiGBUpdate();
        else if (this.gameboys.length == 1) this.gameboys[0].audioSyncUpdate();
        window.requestAnimationFrame(this.update);
    }

    multiGBUpdate() {
        var gbl = this.gameboys.length

        for (var gbn = 0; gbn < gbl; gbn++) {
            if (!(this.gameboys[gbn].options.cButByte)) this.gameboys[gbn].prepareButtonByte();
        }
        var mostCycles = 0;
        while (mostCycles < 70224) {
            for (var gbn = 0; gbn < gbl; gbn++) {
                while (this.gameboys[gbn].frameCycles <= Math.min(mostCycles, 70223)) this.gameboys[gbn].cycle();
                mostCycles = this.gameboys[gbn].frameCycles
            }
        }
        for (var gbn = 0; gbn < gbl; gbn++) {
            this.gameboys[gbn].frameCycles -= 70224;
        }
    }
}
