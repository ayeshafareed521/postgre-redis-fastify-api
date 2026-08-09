console.log("userServices.js Running...");
const pool = require("../config/db");
const { redisClient } = require("../config/redis");


async function getAllUsers() {

    const cachedUsers = await redisClient.get("users");

    if (cachedUsers) {

        console.log("Redis HIT");

        return JSON.parse(cachedUsers);
    }

    console.log("Redis MISS");

    const result = await pool.query(
        "SELECT * FROM users"
    );

    await redisClient.set(
        "users",
        JSON.stringify(result.rows),
        {
            EX: 60
        }
    );

    return result.rows;
}


async function getUserById(id) {

    const cacheKey = `user:${id}`;

    const cachedUser = await redisClient.get(cacheKey);

    if (cachedUser) {

        console.log("Redis HIT");

        return JSON.parse(cachedUser);
    }

    console.log("Redis MISS");

    const result = await pool.query(
        "SELECT * FROM users WHERE id=$1",
        [id]
    );

    if (result.rows.length === 0) {
        return null;
    }

    await redisClient.set(
        cacheKey,
        JSON.stringify(result.rows[0]),
        {
            EX: 60
        }
    );

    return result.rows[0];
}


async function createUser(name, age, position) {

    const result = await pool.query(
        `INSERT INTO users(name, age, position)
         VALUES($1,$2,$3)
         RETURNING *`,
        [name, age, position]
    );

    await redisClient.del("users");

    return result.rows[0];
}


async function updateUser(id, name, age, position) {

    const result = await pool.query(
        `UPDATE users
         SET name=$1,
             age=$2,
             position=$3
         WHERE id=$4
         RETURNING *`,
        [name, age, position, id]
    );

    if (result.rows.length === 0) {
        return null;
    }

    await redisClient.del("users");

    await redisClient.del(`user:${id}`);

    return result.rows[0];
}


async function deleteUser(id) {

    const result = await pool.query(
        "DELETE FROM users WHERE id=$1 RETURNING *",
        [id]
    );

    if (result.rows.length === 0) {
        return null;
    }

    await redisClient.del("users");

    await redisClient.del(`user:${id}`);

    return result.rows[0];
}


module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};