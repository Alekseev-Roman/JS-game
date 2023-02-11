import {mapManager} from "./mapManager.js";
import {gameManager} from "./gameManager.js";
import {soundManager} from "./soundManager.js";

export let physicManager = {
    update: function (obj) {
        if(obj.move_x === 0 && obj.move_y === 0)
            return "stop";

        console.log(obj);

        let newX = obj.pos_x + Math.floor(obj.move_x * obj.speed);
        let newY = obj.pos_y + Math.floor(obj.move_y * obj.speed);

        let sizeX = obj.size_x;
        let sizeY = obj.size_y;

        if(obj.move_y === -1) {
            sizeY -= obj.sizeY;
        }
        if(obj.move_y === 1) {
            sizeY += obj.sizeY;
        }
        if(obj.move_x === -1) {
            sizeX -= obj.sizeX;
        }
        if(obj.move_x === 1) {
            sizeX += obj.sizeX;
        }

        let ts = mapManager.getTilesetIdx(newX + sizeX / 2, newY + sizeY / 2);

        if(ts !== 1 && obj.move_y !== 0 && obj.move_x !== 0) {
            let tsY = mapManager.getTilesetIdx(obj.pos_x + sizeX / 2, newY + sizeY / 2);
            let tsX = mapManager.getTilesetIdx(newX + sizeX / 2, obj.pos_y + sizeY / 2);
            if(tsY === 1) {
                newX = obj.pos_x;
                ts = tsY;
            }
            if(tsX === 1) {
                newY = obj.pos_y;
                ts = tsX;
            }
        }

        let e = this.entityAtXY(obj, newX, newY);

        if(e !== null && obj.onTouchEntity) { // проверка на наличие существа
                obj.onTouchEntity(e);
        }

        if(ts !== 1 && obj.name !== "Player") {
            let last_x = obj.pos_x;
            let last_y = obj.pos_y;

            if(obj.last_y === -1 && obj.last_x === -1) {
                if(obj.move_x === 0) {
                    if(0.5 < Math.random(2))
                        obj.move_x = 1;
                    else
                        obj.move_x = -1;
                    //obj.move_y = 0;
                }
                if(obj.move_y === 0) {
                    //obj.move_x = 0;
                    if(0.5 < Math.random(2)) {
                        obj.move_y = 1;
                    }
                    else
                        obj.move_y = -1;
                }
                if(obj.move_y !== 0 && obj.move_x !== 0) {
                    if(0.5 < Math.random(2)) {
                        //obj.move_x = 0;
                        obj.move_y = -obj.move_y;
                    }
                    else {
                        obj.move_x = -obj.move_x;
                        //obj.move_y = 0;
                    }
                }
                obj.last_x = last_x;
                obj.last_y = last_y;
                return "move";
            } else {
                if(obj.move_x === 0) {
                    if(obj.last_x !== obj.pos_x + Math.floor(1 * obj.speed)) {
                        obj.move_x = 1;
                    } else if(obj.last_x !== obj.pos_x + Math.floor(-1 * obj.speed)) {
                        obj.move_x = -1;
                    }
                    //obj.move_y = 0;
                }
                if(obj.move_y === 0) {
                    if(obj.last_y !== obj.pos_y + Math.floor(1 * obj.speed)) {
                        obj.move_y = 1;
                    } else if(obj.last_y !== obj.pos_y + Math.floor(-1 * obj.speed)) {
                        obj.move_y = -1;
                    }
                    //obj.move_x = 0;
                }
                if(obj.move_y !== 0 && obj.move_x !== 0) {
                    if(obj.last_y !== obj.pos_y + Math.floor(-obj.move_y * obj.speed)) {
                        obj.move_y = -obj.move_y;
                        //obj.move_x = 0;
                    } else if(obj.last_x !== obj.pos_x + Math.floor(-obj.move_x * obj.speed)) {
                        obj.move_x = -obj.move_x;
                        //obj.move_y = 0;
                    }
                }
                obj.last_x = last_x;
                obj.last_y = last_y;
                return "move";
            }
        }

        if(obj.name !== "Player" && this.checkMove(obj)) {
            obj.last_x = -1;
            obj.last_y = -1;
        }

        if(ts === 1) {
            if(obj.name === "Player" && e === null){
                if(obj.timeStep === 0) {
                    soundManager.play("../../storage/step.wav");
                    obj.timeStep = 20;
                }
                gameManager.score += 1;
            } else if(obj.name !== "Player" && (e === null || e.name !== "Player")) {
                if(obj.timeStep === 0) {
                    soundManager.playWorldSound("../../storage/step.wav", obj.pos_x, obj.pos_y);
                    obj.timeStep = 20;
                }
            }
            obj.pos_x = newX;
            obj.pos_y = newY;
        } else {
            return "break";
        }

        return "move";
    },

    entityAtXY: function (obj, x, y) {
        for(let i = 0; i < gameManager.entities.length; i++) {
            let e = gameManager.entities[i];
            if(e.name !== obj.name) {
                if(x + obj.sizeX < e.pos_x || y + obj.sizeY < e.pos_y ||
                    x > e.pos_x + e.sizeX || y > e.pos_y + e.sizeY)
                    continue;
                return e;
            }
        }
        return null;
    },

    checkMove: function (obj) {
        let move_x = 0;
        let move_y = 0;

        if (gameManager.player.pos_x < obj.pos_x) {
            move_x = -1;
        }
        if (gameManager.player.pos_x > obj.pos_x) {
            move_x = 1;
        }
        if (gameManager.player.pos_y < obj.pos_y) {
            move_y = -1;
        }
        if (gameManager.player.pos_y > obj.pos_y) {
            move_y = 1;
        }

        let newX = obj.pos_x + Math.floor(move_x * obj.speed);
        let newY = obj.pos_y + Math.floor(move_y * obj.speed);

        let sizeX = obj.size_x;
        let sizeY = obj.size_y;

        if(move_y === -1) {
            sizeY -= obj.sizeY;
        }
        if(move_y === 1) {
            sizeY += obj.sizeY;
        }
        if(move_x === -1) {
            sizeX -= obj.sizeX;
        }
        if(move_x === 1) {
            sizeX += obj.sizeX;
        }

        let ts = mapManager.getTilesetIdx(newX + sizeX / 2, newY + sizeY / 2);

        if(ts === 1)
            return true;
        return false;
    }
}