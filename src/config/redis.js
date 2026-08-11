console.log("Redis.js Running...");
const { createClient } = require("redis");

class RedisSingleton {

    constructor() {

        // If an instance already exists,
        // return that same instance.
        if (RedisSingleton.instance) {
            return RedisSingleton.instance;
        }

        // Create Redis client only ONCE.
        this.client = createClient({
            socket: {
                host: process.env.REDIS_HOST || "127.0.0.1",
                port: Number(process.env.REDIS_PORT) || 6379
            }
        });

        // Redis error handler
        this.client.on("error", (error) => {
            console.error("Redis Error:", error);
        });

        // Save Singleton instance
        RedisSingleton.instance = this;
    }


    async connect() {

        // Prevent multiple connections
        if (!this.client.isOpen) {

            await this.client.connect();

            console.log(
                "Redis Connected Successfully"
            );
        }
    }


    getClient() {

        return this.client;
    }
}


// Export ONE Singleton instance
module.exports = new RedisSingleton();