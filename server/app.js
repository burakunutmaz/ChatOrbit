const express = require('express');
const { default: helmet } = require('helmet');
const {Server} = require('socket.io');
const cors = require('cors');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
require('dotenv').config();

const authRouter = require('./routes/authRouter');

const app = express();

const server = require('http').createServer(app);

const io = new Server(server, {
    cors:{
        origin: "http://localhost:3000",
        credentials: "true"
    }
});

const redisClient = require('./redis');

app.use(helmet());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
app.use(express.json());

app.use(session({
    secret: process.env.COOKIE_SECRET,
    name: "sid",
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({client: redisClient}),
    cookie: {
        secure: process.env.ENVIRONMENT === "production" ? "true" : "auto",
        httpOnly: true,
        sameSite: process.env.ENVIRONMENT === "production" ? "none" : "lax",
        expires: 1000 * 60 * 60 * 24 * 7
    }
}));

app.use("/auth", authRouter);

app.get("/", (req,res,next) => {
    res.json({message: "hi"});
    next();
})

io.on("connect", socket => {

});

server.listen(4000, () => {
    console.log("Server listening on port 4000");
})