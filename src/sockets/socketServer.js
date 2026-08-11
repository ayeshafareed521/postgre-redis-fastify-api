console.log("SocketServer.js Running...");
const { Server } = require("socket.io");

class SocketServerSingleton {

    constructor() {

        // Return existing Singleton instance
        if (SocketServerSingleton.instance) {
            return SocketServerSingleton.instance;
        }

        // Socket.IO server does not exist yet
        this.io = null;

        // Save Singleton instance
        SocketServerSingleton.instance = this;
    }


    initialize(server) {

        // Create Socket.IO ONLY ONCE
        if (!this.io) {

            this.io = new Server(server, {

                cors: {
                    origin: "*"
                }

            });

            console.log(
                "Socket.IO Singleton Initialized"
            );
        }


        return this.io;
    }


    getIO() {

        if (!this.io) {

            throw new Error(
                "Socket.IO has not been initialized."
            );
        }


        return this.io;
    }
}


module.exports =
    new SocketServerSingleton();