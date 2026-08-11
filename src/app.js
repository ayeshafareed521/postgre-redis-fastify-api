console.log("App.js Running...");
const Fastify = require("fastify");

const rateLimiter = require("./middleware/rateLimiter");

const app = Fastify({
    logger: true
});


app.addHook(
    "onRequest",
    rateLimiter
);


app.register(
    require("./routes/userRoutes")
);


module.exports = app;