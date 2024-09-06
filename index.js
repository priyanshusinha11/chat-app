const http = require("http");
const express = require("express");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("user-message", (data) => {
        const timestamp = new Date().toLocaleTimeString(); 
        const messageData = {
            username: data.username,
            message: data.message,
            time: timestamp,
        };
        io.emit("message", messageData); 
    });
});

app.use(express.static(path.resolve("./public")));

app.get("/", (req, res) => {
    return res.sendFile("/public/index.html");
});

server.listen(9000, () => console.log(`Server Started at PORT:9000`));
