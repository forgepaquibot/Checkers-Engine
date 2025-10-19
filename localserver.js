const http = require("http");
const fs = require("fs");

http.createServer((req, res) => {
    if (req.method == "GET") {
        if (req.url == "/") {
            fs.readFile("index.html", (err, data) => {
                if (err) {
                    res.writeHead(404);
                    res.end("File not found!");
                } else {
                    res.writeHead(200, { "Content-Type": "text/html" })
                    res.end(data);
                }
            })
        } else if (req.url == "/stylesheet.css") {
                fs.readFile("stylesheet.css", (err, data) => {
                if (err) {
                    res.writeHead(404);
                    res.end("File not found!");
                } else {
                    res.writeHead(200, { "Content-Type": "text/css" })
                    res.end(data);
                }
            });
        } else if (req.url == "/controller.js") {
                fs.readFile("controller.js", (err, data) => {
                if (err) {
                    res.writeHead(404);
                    res.end("File not found!");
                } else {
                    res.writeHead(200, { "Content-Type": "text/javascript" })
                    res.end(data);
                }
            });
        } else if (req.url == "/GameModel.js") {
                fs.readFile("GameModel.js", (err, data) => {
                if (err) {
                    res.writeHead(404);
                    res.end("File not found!");
                } else {
                    res.writeHead(200, { "Content-Type": "text/javascript" })
                    res.end(data);
                }
            });
        } else if (req.url.endsWith("blackpawn.png")) {
                fs.readFile("Sprites/blackpawn.png", (err, data) => {
                if (err) {
                    res.writeHead(404);
                    res.end("File not found!");
                } else {
                    res.writeHead(200, { "Content-Type": "image/png" })
                    res.end(data);
                }
            });
        } else if (req.url.endsWith("redpawn.png")) {
                fs.readFile("Sprites/redpawn.png", (err, data) => {
                if (err) {
                    res.writeHead(404);
                    res.end("File not found!");
                } else {
                    res.writeHead(200, { "Content-Type": "image/png" })
                    res.end(data);
                }
            });
        }   
    } 
}).listen(2000, () => console.log("Listening at: http://127.0.0.1:2000/"));