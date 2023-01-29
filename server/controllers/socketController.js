const redisClient = require('../redis');

exports.authorizeUser = (socket, next) => {
    if (!socket.request.session || !socket.request.session.user){
        next(new Error("Not authorized."));
    } else {
        next();
    }
};

exports.initializeUser = async socket => {
    socket.user = {...socket.request.session.user};
    socket.join(socket.user.userid);
    await redisClient.hset(
        `userid:${socket.user.username}`,
            "userid", socket.user.userid,
            "connected", true
    );
    const friendsList = await redisClient.lrange(
        `friends:${socket.user.username}`,
        0, -1
    );

    const parsedFriendsList = await this.parseFriendsList(friendsList);
    const friendChats = parsedFriendsList.map(friend => {
        return friend.userid;
    });

    console.log(parsedFriendsList);

    console.log(friendChats.length);
    if (friendChats.length > 0){
        socket.to(friendChats).emit("connected", true, socket.user.username);
    }

    socket.emit("friends", parsedFriendsList);

    const messagesString = await redisClient.lrange(`chat:${socket.user.userid}`, 0,-1);
    // to.from.content
    const messages = messagesString.map(string => {
        const parsedString = messagesString.split(".");
        return {to: parsedString[0], from: parsedString[1], content: parsedString[2]};
    })

    if (messages && messages.length > 0){
        socket.emit("messages", messages);
    }

}

exports.addFriend = async (socket, friendName, cb) => {
    if (friendName === socket.user.username) {
        cb({done: false, err: "Can not add self"});
        return;
    }

    const currentFriendList = await redisClient.lrange(
        `friends:${socket.user.username}`,
        0, -1
    );

    const friend = await redisClient.hgetall(
        `userid:${friendName}`
    );

    console.log("FRIEND: ", friend);
    
    if (!friend.userid) {
        cb({done: false, err: "User does not exist"});
        return;
    }

    if (currentFriendList && currentFriendList.indexOf(friendName) !== -1){
        cb({done: false, err: "They are already your friend.."});
        return;
    }

    await redisClient.lpush(`friends:${socket.user.username}`,
        [friendName, friend.userid].join("."));
    const newFriend = {
        username:friendName,
        userid:friend.userid,
        connected: friend.connected
    }
    cb({done: true, newFriend});
};

exports.onDisconnect = async (socket) => {
    await redisClient.hset(
        `userid:${socket.user.userid}`,
            "connected", false
    );

    const friendsList = await redisClient.lrange(
        `friends:${socket.user.username}`, 0, -1);

    const friendChats = await this.parseFriendsList(friendsList);
    friendChats.map(friend => {
        return friend.userid;
    });

    socket.to(friendChats).emit("connected", false, socket.user.username);
};

exports.parseFriendsList = async (friendsList) => {
    const newFriendsList = [];
    for (let friend of friendsList){

        const parsedFriend = friend.split(".");
        console.log("UNPARSED: ", friend);
        console.log("PARSED: ", parsedFriend);
        const friendConnected = await redisClient.hget(
            `userid:${parsedFriend[0]}`,
            "connected"
        );
        newFriendsList.push({username: parsedFriend[0],
                            userid: parsedFriend[1],
                            connected: friendConnected});
    };

    return newFriendsList;
};

exports.dm = async (socket, message) => {
    message.from = socket.user.userid;

    // to.from.content
    const messageString = [message.to, message.from, message.content].join(".");

    await redisClient.lpush(`chat:${message.to}`, messageString);
    await redisClient.lpush(`chat:${message.from}`, messageString);

    socket.to(message.to).emit("dm", message);
}