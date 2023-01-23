const express = require('express');
const { default: helmet } = require('helmet');
const {Server} = require('socket.io');
const cors = require('cors');

const authRouter = require('./routes/authRouter');

const app = express();

const server = require('http').createServer(app);

const io = new Server(server, {
    cors:{
        origin: "http://localhost:3000",
        credentials: "true"
    }
});

app.use(helmet());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
app.use(express.json());

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