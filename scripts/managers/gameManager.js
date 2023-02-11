import {eventsManager} from "./eventsManager.js";
import {mapManager} from "./mapManager.js";
import {spriteManager} from "./spriteManager.js";
import {Player} from "../entitites/player.js";
import {Enemy} from "../entitites/enemy.js";
import {Heal} from "../entitites/heal.js";
import {Card} from "../entitites/card.js";
import {saveResult} from "../results.js";
import {soundManager} from "./soundManager.js";
export let gameManager = {
    factory: {},
    ctx: null,
    entities: [],
    player: null,
    laterKill: [],
    cardsCounter: 0,
    cards: 0,
    score: 0,
    gameOverFlag: false,
    lvl: 1,
    levels: ["../storage/lvl1.json", "../storage/lvl2.json"],

    initPlayer: function (obj) {
        this.player = obj;
    },

    kill: function (obj) {
        this.laterKill.push(obj);
    },

    update: function () {
        if(this.player === null) {
            return;
        }

        if(this.cards === this.cardsCounter)
            this.newLVL();

        this.updateScore();
        this.updateHeals();
        this.updateTimes();

        this.player.move_x = 0;
        this.player.move_y = 0;

        if(eventsManager.action['up'])
            this.player.move_y = -1;
        if(eventsManager.action['down'])
            this.player.move_y = 1;
        if(eventsManager.action['left'])
            this.player.move_x = -1;
        if(eventsManager.action['right'])
            this.player.move_x = 1;

        for(let en of this.entities) {
            if(en.name.match(/Enemy[\d]/))
                en.move(this.player.pos_x, this.player.pos_y);
        }

        this.entities.forEach(function (e) {
            try {
                e.update();
            } catch (ex) {}
        });

        for(let i = 0; i < this.laterKill.length; i++){
            let idx = this.entities.indexOf(this.laterKill[i]);
            if(idx > -1)
                this.entities.splice(idx, 1)
        }
        if(this.laterKill.length > 0)
            this.laterKill.length = 0;

        mapManager.draw(this.ctx);
        this.draw(this.ctx);
    },

    draw: function (ctx) {
        for(let e = 0; e < this.entities.length; e++)
            this.entities[e].draw(ctx);
    },

    loadAll: function (ctx, lvl) {
        gameManager.lvl = lvl;
        mapManager.loadMap(gameManager.levels[gameManager.lvl - 1]);
        spriteManager.loadAtlas("../storage/sprites.json", "../storage/spritesheet.png");
        gameManager.factory['Player'] = Player;
        gameManager.factory['Enemy'] = Enemy;
        gameManager.factory['Heal'] = Heal;
        gameManager.factory['Card'] = Card;
        soundManager.init();
        soundManager.loadArray(["../../storage/step.wav"]);
        mapManager.parseEntities();
        mapManager.draw(ctx);
        eventsManager.setup();
        gameManager.ctx = ctx;
    },

    updateScore: function () {
        let score = document.getElementById('score');
        score.textContent = gameManager.score;
    },

    updateHeals: function () {
        let score = document.getElementById('heals');
        score.textContent = this.player.lifetime;
    },

    updateTimes() {
        if(this.player.damageTime > 0)
            this.player.damageTime -= 1;
        for(let obj of gameManager.entities) {
            if(!obj.name.match(/Heal[\d]/) && !obj.name.match(/Card[\d]/))
                if(obj.timeStep > 0)
                    obj.timeStep -= 1
        }
    },

    play: function () {
        setInterval(function () {
            if(!gameManager.gameOverFlag)
                updateWorld()
        }, 50);
    },

    gameOver() {
        gameManager.gameOverFlag = true;
        window.location.href="/";
    },

    win() {
        gameManager.gameOverFlag = true;
        window.location.href="/";
    },

    newLVL() {
        gameManager.score += gameManager.player.lifetime * 100;
        saveResult(gameManager.score, gameManager.lvl);
        gameManager.lvl += 1;
        if(gameManager.lvl > 2) {
            gameManager.win();
            return;
        }
        window.location.href=`/lvl${gameManager.lvl}`;
        gameManager.loadAll(gameManager.ctx);
    }
}

function updateWorld() {
    gameManager.update();
}