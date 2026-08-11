console.log("ChatRateLimiter.js Running...");
const redis =
    require("../config/redis.js");

const redisClient =
    redis.getClient();


async function checkChatRateLimit(
    userId
) {

    const key =
        `chat_rate_limit:${userId}`;

    const limit = 10;

    const window = 10;


    const current =
        await redisClient.incr(key);


    if (current === 1) {

        await redisClient.expire(
            key,
            window
        );
    }


    return {

        allowed:
            current <= limit,

        remaining:
            Math.max(
                0,
                limit - current
            )

    };
}


module.exports =
    checkChatRateLimit;