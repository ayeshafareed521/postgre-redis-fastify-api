console.log("Server.js Running...");
require("dotenv").config();

const http =
    require("http");


const app =
    require("./app.js");


const redis =
    require("./config/redis.js");


const socketServer =
    require("./sockets/socketServer.js");


const registerChatSocket =
    require("./sockets/chatSockets.js");


const PORT =
    Number(
        process.env.PORT
    ) || 3000;


async function startServer() {

    try {

        // ==========================================
        // REDIS
        // ==========================================

        await redis.connect();


        // ==========================================
        // FASTIFY
        // ==========================================

        await app.ready();


        // ==========================================
        // HTTP SERVER
        // ==========================================

        const server =
            http.createServer(
                (req, res) => {

                    app.routing(
                        req,
                        res
                    );

                }
            );


        // ==========================================
        // SOCKET.IO SINGLETON
        // ==========================================

        const io =
            socketServer.initialize(
                server
            );


        // ==========================================
        // CHAT
        // ==========================================

        registerChatSocket(io);


        // ==========================================
        // START
        // ==========================================

        server.listen(
            PORT,
            "127.0.0.1",
            () => {

                console.log(
                    `Server running on http://localhost:${PORT}`
                );

            }
        );


    } catch (error) {

        console.error(
            "Server startup failed:",
            error
        );

        process.exit(1);

    }

}


startServer();