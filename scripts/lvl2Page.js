import {gameManager} from "./managers/gameManager.js";
import {setName} from "./results.js";

let canvas = document.getElementById("canvasLVL2");
let ctx = canvas.getContext("2d");

canvas.width = 640;
canvas.height = 640;

setName();
gameManager.loadAll(ctx, 2);
gameManager.play();