console.log("Controller Running...");
const userService = require("../services/userService");

async function getUsers(request, reply) {

    const users = await userService.getAllUsers();

    return users;
}


async function getUser(request, reply) {

    const { id } = request.params;

    const user = await userService.getUserById(id);

    if (!user) {
        return reply.status(404).send({
            message: "User not found"
        });
    }

    return user;
}


async function createUser(request, reply) {

    const { name, age, position } = request.body;

    if (!name || !age || !position) {
        return reply.status(400).send({
            message: "All fields are required"
        });
    }

    const user = await userService.createUser(
        name,
        age,
        position
    );

    return reply.status(201).send(user);
}


async function updateUser(request, reply) {

    const { id } = request.params;

    const { name, age, position } = request.body;

    const user = await userService.updateUser(
        id,
        name,
        age,
        position
    );

    if (!user) {
        return reply.status(404).send({
            message: "User not found"
        });
    }

    return user;
}


async function deleteUser(request, reply) {

    const { id } = request.params;

    const user = await userService.deleteUser(id);

    if (!user) {
        return reply.status(404).send({
            message: "User not found"
        });
    }

    return {
        message: "User deleted successfully"
    };
}


module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
};