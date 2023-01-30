const redisClient = require("../redis");

exports.rateLimiter = (limitSeconds, limitAmount) => {
    return async (req,res,next) => {
    const ip =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const response = await redisClient
        .multi()
        .incr(ip)
        .expire(ip, limitSeconds).exec();

    if (response[1] > limitAmount){
        res.json({loggedIn: false, status: "Slow down.. try again one minute later."});
    } else {
        next();
    }

};
};
