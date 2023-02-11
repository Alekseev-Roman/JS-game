import {Entity} from "./entity.js";
import {spriteManager} from "../managers/spriteManager.js";
import {gameManager} from "../managers/gameManager.js";

export let Card = Entity.extend({
    sizeX: 10,
    sizeY: 10,

    draw: function (ctx) {
        spriteManager.drawSprite(ctx, "card", this.pos_x, this.pos_y);
    },

    kill: function () {
        gameManager.kill(this);
    }
});