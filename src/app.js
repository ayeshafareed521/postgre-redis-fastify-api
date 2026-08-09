console.log("App Running...");
const Fastify = require("fastify");
const app = Fastify();
app.register(require("./routes/userRoutes"));
module.exports = app;