console.log("DB requiring env");
require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

pool.connect()
    .then(client => {
        console.log("PostgreSQL Connected Successfully");
        client.release();
    })
    .catch(err => {
        console.error("Connection Failed:", err.message);
    });

module.exports = pool;