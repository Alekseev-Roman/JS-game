import {gameManager} from "./gameManager.js";
export let mapManager = {
    mapData: null,
    tLayer: null,
    xCount: 0,
    yCount: 0,
    tSize: {x: 32, y: 32},
    mapSize: {x: 32, y: 32},
    tilesets: new Array(),
    imgLoadCount: 0,
    imgLoaded: false,
    jsonLoaded: false,

    parseMap(tilesJSON) {
        this.mapData = JSON.parse(tilesJSON);
        this.xCount = this.mapData.width;
        this.yCount = this.mapData.height;
        this.tSize.x = this.mapData.tilewidth;
        this.tSize.y = this.mapData.tileheight;
        this.mapSize.x = this.xCount * this.tSize.x;
        this.mapSize.y = this.yCount * this.tSize.y;

        for(let i = 0; i < this.mapData.tilesets.length; i++) {
            let img = new Image();

            img.onload = function () {
                mapManager.imgLoadCount++;
                if(mapManager.imgLoadCount === mapManager.mapData.tilesets.length) {
                    mapManager.imgLoaded = true;
                }
            };
            img.src = this.mapData.tilesets[i].image;

            let t = this.mapData.tilesets[i];
            let ts = {
                firstgid: t.firstgid,
                image: img,
                name: t.name,
                xCount: Math.floor(t.imagewidth / mapManager.tSize.x),
                yCount: Math.floor(t.imageheight / mapManager.tSize.y)
            };

            this.tilesets.push(ts);
        }
        this.jsonLoaded = true;
    },

    draw(ctx) {
        if(!mapManager.imgLoaded || !mapManager.jsonLoaded) {
            setTimeout(function () {mapManager.draw(ctx);}, 100);
        } else {
            if(this.tLayer === null)
                for(let id = 0; id < this.mapData.layers.length; id++) {
                    let layer = this.mapData.layers[id];
                    if(layer.type === "tilelayer") {
                        this.tLayer = layer;
                        break;
                    }
                }
            for(let i = 0; i < this.tLayer.data.length; i++) {
                if(this.tLayer.data[i] !== 0) {
                    let tile = this.getTile(this.tLayer.data[i]);
                    let pX = (i % this.xCount) * this.tSize.x;
                    let pY = Math.floor(i / this.xCount) * this.tSize.y;
                    ctx.drawImage(tile.img, tile.px, tile.py, this.tSize.x, this.tSize.y,
                        pX, pY, this.tSize.x, this.tSize.y);
                }
            }
        }
    },

    getTile(tileIndex) {
        let tile = {
            img: null,
            px: 0,
            py: 0
        };
        let tileset = this.getTileset(tileIndex);
        tile.img = tileset.image;
        let id = tileIndex - tileset.firstgid;
        let x = id % tileset.xCount;
        let y = Math.floor(id / tileset.xCount);
        tile.px = x * mapManager.tSize.x;
        tile.py = y * mapManager.tSize.y;
        return tile;
    },

    getTileset(tileIndex) {
        for(let i = mapManager.tilesets.length - 1; i >= 0; i--) {
            if(mapManager.tilesets[i].firstgid <= tileIndex) {
                return mapManager.tilesets[i];
            }
        }
        return null;
    },

    loadMap(path) {
        let request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                mapManager.parseMap(request.responseText);
            }
        };
        request.open("GET", path, true);
        request.send();
    },

    parseEntities() {
        if(!mapManager.imgLoaded || !mapManager.jsonLoaded) {
            setTimeout(function () {mapManager.parseEntities();}, 100);
        } else {
            for(let j = 0; j < this.mapData.layers.length; j++) {
                if(this.mapData.layers[j].type === 'objectgroup') {
                    let entities = this.mapData.layers[j];

                    for(let i = 0; i < entities.objects.length; i++) {
                        let e = entities.objects[i];

                        try{
                            let obj = Object.create(gameManager.factory[e.class]);
                            obj.name = e.name;
                            obj.pos_x = e.x;
                            obj.pos_y = e.y;
                            obj.size_x = e.width;
                            obj.size_y = e.height;
                            gameManager.entities.push(obj);
                            if(obj.name.match(/Card[\d]/)){
                                gameManager.cards += 1;
                            }
                            if(obj.name === "Player") {
                                gameManager.initPlayer(obj);
                            }
                        } catch (ex) {
                            console.log(`Error while creating: [${e.gid}] ${e.class}, ${ex}`);
                        }
                    }
                }
            }
        }
    },

    getTilesetIdx(x, y) {
        let wX = x;
        let wY = y;
        let idx = Math.floor(wY / this.tSize.y) * this.xCount + Math.floor(wX / this.tSize.x);
        return this.tLayer.data[idx];
    }
}
