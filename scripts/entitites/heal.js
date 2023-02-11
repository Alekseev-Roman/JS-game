import {Entity} from "./entity.js";
import {spriteManager} from "../managers/spriteManager.js";
import {gameManager} from "../managers/gameManager.js";

export let Heal = Entity.extend({
    sizeX: 7,
    sizeY: 7,

    draw: function (ctx) {
        spriteManager.drawSprite(ctx, "heal", this.pos_x, this.pos_y);
    },

    kill: function () {
        gameManager.kill(this);
    }
});