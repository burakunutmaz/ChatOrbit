const express = require('express');
const { default: helmet } = require('helmet');
const {Server} = require('socket.io');
const cors = require('cors');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
require('dotenv').config();

const authRouter = require('./routes/authRouter');
const {sessionMiddleware, wrap, corsConfig} = require('./controllers/serverController');
const { authorizeUser, addFriend, initializeUser, onDisconnect, dm } = require('./controllers/socketController');

const app = express();

const server = require('http').createServer(app);

const io = new Server(server, {
    cors: corsConfig
});

app.use(helmet());
app.use(cors(corsConfig))
app.use(express.json());

app.use(sessionMiddleware);

app.use("/auth", authRouter);

io.use(wrap(sessionMiddleware));
io.use(authorizeUser);
io.on("connect", socket => {
    initializeUser(socket);

    socket.on("add_friend", (friendName, cb) => {
        addFriend(socket, friendName, cb);
    });

    socket.on("dm", (message) => {
        dm(socket, message);
    });

    socket.on("disconnecting", () => {
        onDisconnect(socket);
    });
});

server.listen(4000, () => {
    console.log("Server listening on port 4000");
})