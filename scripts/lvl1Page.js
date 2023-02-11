import {gameManager} from "./managers/gameManager.js";
import {setName} from "./results.js";

let canvas = document.getElementById("canvasLVL1");
let ctx = canvas.getContext("2d");

canvas.width = 480;
canvas.height = 480;

setName();
gameManager.loadAll(ctx, 1);
gameManager.play();