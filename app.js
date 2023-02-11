let express = require('express');
let server = express();
let routes = require("./routes");

let https = require('https');
let fs = require('fs');

let options = {
    cert: fs.readFileSync('./https/example.crt'),
    key: fs.readFileSync('./https/example.key')
};

server.set("view engine", "ejs");
server.set("views", `./views`);

server.use(express.json());
server.use("/styles", express.static(`styles`));
server.use("/scripts", express.static(`scripts`));
server.use('/', routes);

https.createServer(options, server).listen(8080);
