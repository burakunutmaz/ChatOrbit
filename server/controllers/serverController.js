const redisClient = require('../redis');
require('dotenv').config();
const session = require('express-session');
const RedisStore = require('connect-redis')(session);



const sessionMiddleware = session({
    secret: process.env.COOKIE_SECRET,
    name: "sid",
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({client: redisClient}),
    cookie: {
        secure: process.env.NODE_ENV === "production" ? "true" : "auto",
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        expires: 1000 * 60 * 60 * 24 * 7
    }
})

const wrap = expressMiddleware => (socket, next) => expressMiddleware(socket.request, {},  next);

const corsConfig = {
    origin: process.env.CLIENT_URL,
    credentials: true
}

module.exports = { sessionMiddleware, wrap, corsConfig };