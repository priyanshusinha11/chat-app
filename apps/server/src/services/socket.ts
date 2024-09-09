import { Server } from "socket.io";
import Redis from "ioredis";

const pub = new Redis({
    host: process.env.REDIS_HOST,
    port: 24803,
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASS,
});

const sub = new Redis({
    host: process.env.REDIS_HOST,
    port: 24803,
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASS,
})
class SocketService {
    private _io: Server;

    constructor() {
        console.log("Init Socket Service...");
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*",
            },
        });

        sub.on("error", (err) => console.error("Redis Subscriber Error:", err));
        sub.subscribe("MESSAGES", (err, count) => {
            if (err) {
                console.error("Failed to subscribe to channel 'MESSAGES':", err.message);
            } else {
                console.log(`Subscribed successfully! This client is currently subscribed to ${count} channels.`);
            }
        });
    }

    public initListeners() {
        const io = this.io;
        console.log("Init Socket Listeners...");

        io.on("connect", (socket) => {
            console.log(`New Socket Connected`, socket.id);
            socket.on("event:message", async ({ message }: { message: string }) => {
                console.log("New Message Rec.", message);
                try {
                    await pub.publish("MESSAGES", JSON.stringify({ message }));
                } catch (err) {
                    console.error("Failed to publish message:", err);
                }
            });
        });

        sub.on("message", (channel, message) => {
            if (channel === "MESSAGES") {
                console.log("new message from redis", message);
                io.emit("message", message);
            }
        });
    }

    get io() {
        return this._io;
    }
}

export default SocketService;
