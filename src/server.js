console.log("Server.js Running...");
require("dotenv").config();

const db = require("./config/db");
const { connectRedis } = require("./config/redis");

const app = require("./app");

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {

        await connectRedis();

        await app.listen({
            port: PORT
        });

        console.log(`Server running on port ${PORT}`);

    } catch (err) {

        console.error(err);

        process.exit(1);
    }
}

startServer();