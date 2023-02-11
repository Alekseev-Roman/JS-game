let express = require("express");
let router = express.Router();

router.get("/", (req, res) => {
    res.render('mainPage');
});

router.get("/lvl1", (req, res) => {
    res.render(`lvl1Page`);
});

router.get("/lvl2", (req, res) => {
    res.render('lvl2Page');
});

router.get("/storage/lvl1.json", (req, res) => {
    res.download(`storage/lvl1.json`);
});

router.get("/storage/lvl2.json", (req, res) => {
    res.download(`storage/lvl2.json`);
});

router.get("/tiles.png", (req, res) => {
    res.download(`storage/tiles.png`);
});

router.get("/storage/sprites.json", (req, res) => {
    res.download(`storage/sprites.json`);
});

router.get("/storage/spritesheet.png", (req, res) => {
    res.download(`storage/spritesheet.png`);
});

router.get("/storage/step.wav", (req, res) => {
    res.download(`storage/step.wav`);
});

module.exports = router;
