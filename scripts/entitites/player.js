import {Entity} from "./entity.js";
import {spriteManager} from "../managers/spriteManager.js";
import {physicManager} from "../managers/physicManager.js";
import {gameManager} from "../managers/gameManager.js";

export let Player = Entity.extend({
    lifetime: 1,
    move_x: 0,
    move_y: 0,
    sizeX: 12,
    sizeY: 20,
    speed: 4,
    damageTime: 0,
    timeStep: 0,

    draw: function (ctx) {
        spriteManager.drawSprite(ctx, "player_right", this.pos_x, this.pos_y);
    },

    update: function () {
        physicManager.update(this);
    },

    onTouchEntity: function (obj) {
        if(obj.name.match(/Heal[\d]/)) {
            this.lifetime += 1;
            gameManager.score += 50;
            obj.kill();
        }
        if(obj.name.match(/Card[\d]/)) {
            gameManager.cardsCounter += 1;
            gameManager.score += 100;
            obj.kill();
        }/*
        if(obj.name.match(/Enemy[\d]/)) {
            if(this.damageTime === 0) {
                this.lifetime -= 1;
                this.damageTime = 15;
            }
            if(this.lifetime === 0) {
                gameManager.updateHeals();
                gameManager.gameOver();
            }
        }*/
    },

    kill: function () {}
});