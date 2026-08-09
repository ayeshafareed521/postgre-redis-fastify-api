console.log("Routes Running...");
const controller = require("../controllers/userController");

async function routes(fastify) {

    fastify.get("/users", controller.getUsers);

    fastify.get("/users/:id", controller.getUser);

    fastify.post("/users", controller.createUser);

    fastify.put("/users/:id", controller.updateUser);

    fastify.delete("/users/:id", controller.deleteUser);
}

module.exports = routes;