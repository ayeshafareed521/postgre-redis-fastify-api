console.log("ChatSocket.js Running...");
const redis =
    require("../config/redis.js");

const redisClient =
    redis.getClient();


const chatService =
    require("../services/chatServices");


const checkChatRateLimit =
    require("../middleware/chatRateLimiter");


function registerChatSocket(io) {


    io.on(
        "connection",
        (socket) => {

            console.log(
                `Socket connected: ${socket.id}`
            );


            // ==========================================
            // JOIN ROOM
            // ==========================================

            socket.on(
                "joinRoom",
                async ({
                    userId,
                    room
                }) => {

                    try {

                        if (
                            !userId ||
                            !room
                        ) {

                            socket.emit(
                                "chatError",
                                {
                                    message:
                                        "userId and room are required"
                                }
                            );

                            return;
                        }


                        // Join Socket.IO room
                        socket.join(room);


                        // Store information on socket
                        socket.data.userId =
                            userId;

                        socket.data.room =
                            room;


                        // Add user to Redis
                        await redisClient.sAdd(
                            `room:${room}:users`,
                            String(userId)
                        );


                        console.log(
                            `User ${userId} joined room ${room}`
                        );


                        // Get previous messages
                        const messages =
                            await chatService.getMessages(
                                room
                            );


                        // Send history to this client
                        socket.emit(
                            "chatHistory",
                            messages
                        );


                        // Tell other users
                        socket.to(room).emit(
                            "userJoined",
                            {
                                userId,
                                room
                            }
                        );


                    } catch (error) {

                        console.error(
                            "Join room error:",
                            error
                        );


                        socket.emit(
                            "chatError",
                            {
                                message:
                                    "Failed to join room"
                            }
                        );
                    }

                }
            );


            // ==========================================
            // SEND MESSAGE
            // ==========================================

            socket.on(
                "sendMessage",
                async ({
                    userId,
                    room,
                    message
                }) => {

                    try {

                        if (
                            !userId ||
                            !room ||
                            !message
                        ) {

                            socket.emit(
                                "chatError",
                                {
                                    message:
                                        "userId, room and message are required"
                                }
                            );

                            return;
                        }


                        message =
                            message.trim();


                        if (!message) {

                            socket.emit(
                                "chatError",
                                {
                                    message:
                                        "Message cannot be empty"
                                }
                            );

                            return;
                        }


                        if (
                            message.length > 1000
                        ) {

                            socket.emit(
                                "chatError",
                                {
                                    message:
                                        "Message cannot exceed 1000 characters"
                                }
                            );

                            return;
                        }


                        // ==================================
                        // REDIS CHAT RATE LIMIT
                        // ==================================

                        const rate =
                            await checkChatRateLimit(
                                userId
                            );


                        if (!rate.allowed) {

                            socket.emit(
                                "chatRateLimited",
                                {
                                    message:
                                        "You are sending messages too quickly.",

                                    retryAfter:
                                        10,

                                    remaining:
                                        rate.remaining
                                }
                            );

                            return;
                        }


                        // ==================================
                        // SAVE TO POSTGRES
                        // ==================================

                        const savedMessage =
                            await chatService.saveMessage(
                                userId,
                                room,
                                message
                            );


                        // ==================================
                        // BROADCAST
                        // ==================================

                        io.to(room).emit(
                            "newMessage",
                            savedMessage
                        );


                    } catch (error) {

                        console.error(
                            "Send message error:",
                            error
                        );


                        socket.emit(
                            "chatError",
                            {
                                message:
                                    "Failed to send message"
                            }
                        );
                    }

                }
            );


            // ==========================================
            // GET ONLINE USERS
            // ==========================================

            socket.on(
                "getOnlineUsers",
                async ({
                    room
                }) => {

                    try {

                        if (!room) {

                            socket.emit(
                                "chatError",
                                {
                                    message:
                                        "Room is required"
                                }
                            );

                            return;
                        }


                        const users =
                            await redisClient.sMembers(
                                `room:${room}:users`
                            );


                        socket.emit(
                            "onlineUsers",
                            {
                                room,
                                users
                            }
                        );


                    } catch (error) {

                        console.error(
                            "Online users error:",
                            error
                        );


                        socket.emit(
                            "chatError",
                            {
                                message:
                                    "Failed to get online users"
                            }
                        );
                    }

                }
            );


            // ==========================================
            // LEAVE ROOM
            // ==========================================

            socket.on(
                "leaveRoom",
                async ({
                    room
                }) => {

                    try {

                        const userId =
                            socket.data.userId;


                        socket.leave(room);


                        if (userId) {

                            await redisClient.sRem(
                                `room:${room}:users`,
                                String(userId)
                            );
                        }


                        socket.to(room).emit(
                            "userLeft",
                            {
                                userId,
                                room
                            }
                        );


                    } catch (error) {

                        console.error(
                            "Leave room error:",
                            error
                        );
                    }

                }
            );


            // ==========================================
            // DISCONNECT
            // ==========================================

            socket.on(
                "disconnect",
                async () => {

                    try {

                        const userId =
                            socket.data.userId;

                        const room =
                            socket.data.room;


                        if (
                            userId &&
                            room
                        ) {

                            await redisClient.sRem(
                                `room:${room}:users`,
                                String(userId)
                            );


                            socket.to(room).emit(
                                "userLeft",
                                {
                                    userId,
                                    room
                                }
                            );
                        }


                        console.log(
                            `Socket disconnected: ${socket.id}`
                        );


                    } catch (error) {

                        console.error(
                            "Disconnect cleanup error:",
                            error
                        );
                    }

                }
            );

        }
    );
}


module.exports =
    registerChatSocket;