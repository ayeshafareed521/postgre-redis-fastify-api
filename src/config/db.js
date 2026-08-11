console.log("DB requiring env");
const { Pool } =
    require("pg");


const pool =
    new Pool({

        host:
            process.env.DB_HOST || "127.0.0.1",

        port:
            Number(
                process.env.DB_PORT
            ) || 5432,

        user:
            process.env.DB_USER,

        password:
            process.env.DB_PASSWORD,

        database:
            process.env.DB_NAME

    });


pool.on(
    "connect",
    () => {

        console.log(
            "PostgreSQL Connected"
        );

    }
);


pool.on(
    "error",
    (error) => {

        console.error(
            "PostgreSQL Pool Error:",
            error
        );

    }
);


module.exports =
    pool;