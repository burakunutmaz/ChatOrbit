import { useContext } from "react";
import { useEffect } from "react";
import socket from "../../socket";
import { AccountContext } from "../AccountContext";

const useSocketSetup = setFriendsList => {

    const {setUser} = useContext(AccountContext);

    useEffect(() => {
        socket.connect();
        socket.on("friends", friendsList => {
            setFriendsList(friendsList);
        })
        socket.on("connected", (status, username) => {
            console.log("on connect: ", username, status);
            setFriendsList(prevFriends => {
                return [...prevFriends].map(friend => {
                    if (friend.username === username){
                        friend.connected = status;
                    }
                    return friend;
                })
            })
        });
        socket.on("connect_error", () => {
            setUser({loggedIn: false});
        });
        return () => {
            socket.off("connect_error");
        }
    }, [setUser])
};

export default useSocketSetup;