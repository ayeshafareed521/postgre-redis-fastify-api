console.log("rateLimiter.js Running...");
const redis =
    require("../config/redis.js");

const redisClient =
    redis.getClient();


async function rateLimiter(
    request,
    reply
) {

    try {

        const ip = request.ip;

        const key =
            `rate_limit:${ip}`;

        const limit = 10;

        const window = 60;


        const current =
            await redisClient.incr(key);


        if (current === 1) {

            await redisClient.expire(
                key,
                window
            );
        }


        reply.header(
            "X-RateLimit-Limit",
            limit
        );


        reply.header(
            "X-RateLimit-Remaining",
            Math.max(
                0,
                limit - current
            )
        );


        if (current > limit) {

            return reply
                .code(429)
                .send({

                    error:
                        "Too many requests",

                    message:
                        "Rate limit exceeded. Try again later."

                });
        }


    } catch (error) {

        console.error(
            "Rate limiter error:",
            error
        );

        // Don't crash API if Redis fails
        return;
    }
}


module.exports =
    rateLimiter;