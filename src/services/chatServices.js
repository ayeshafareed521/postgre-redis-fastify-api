console.log("ChatServices.js Running...");
const pool =
    require("../config/db.js");


async function saveMessage(
    userId,
    room,
    message
) {

    const result =
        await pool.query(
            `
            INSERT INTO messages
                (sender_id, room, message)
            VALUES
                ($1, $2, $3)
            RETURNING
                id,
                sender_id,
                room,
                message,
                created_at
            `,
            [
                userId,
                room,
                message
            ]
        );


    return result.rows[0];
}


async function getMessages(
    room
) {

    const result =
        await pool.query(
            `
            SELECT
                m.id,
                m.sender_id,
                u.name AS sender_name,
                m.room,
                m.message,
                m.created_at
            FROM messages m
            JOIN users u
                ON u.id = m.sender_id
            WHERE m.room = $1
            ORDER BY m.created_at ASC
            `,
            [room]
        );


    return result.rows;
}


module.exports = {

    saveMessage,

    getMessages

};