import {Entity} from "./entity.js";
import {spriteManager} from "../managers/spriteManager.js";
import {physicManager} from "../managers/physicManager.js";
import {gameManager} from "../managers/gameManager.js";

export let Enemy = Entity.extend({
    lifetime: 1,
    move_x: 0,
    move_y: 0,
    last_x: -1,
    last_y: -1,
    sizeX: 9,
    sizeY: 14,
    speed: 2,
    timeStep: 0,

    draw: function (ctx) {
        spriteManager.drawSprite(ctx, "enemy_right", this.pos_x, this.pos_y);
    },

    update: function () {
        physicManager.update(this);
    },

    onTouchEntity: function (obj) {
        if(obj.name === "Player") {
            if(obj.damageTime === 0) {
                obj.lifetime -= 1;
                obj.damageTime = 15;
            }
            if(obj.lifetime === 0) {
                gameManager.updateHeals();
                gameManager.gameOver();
            }
        }
    },

    move: function (x, y) {
        if(this.last_x === -1) {
            this.move_x = 0;
            this.move_y = 0;
            if (x < this.pos_x) {
                this.move_x = -1;
            }
            if (x > this.pos_x) {
                this.move_x = 1;
            }
            if (y < this.pos_y) {
                this.move_y = -1;
            }
            if (y > this.pos_y) {
                this.move_y = 1;
            }
        }
    },

    kill: function () {
        gameManager.kill(this);
    }
});