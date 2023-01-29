import React from 'react'
import { Grid, GridItem, Tabs} from '@chakra-ui/react'
import Sidebar from './Sidebar';
import Chat from './Chat';
import { createContext, useState } from 'react';
import useSocketSetup from './useSocketSetup';

export const FriendContext = createContext();

const Home = () => {
    const [friendsList, setFriendsList] = useState([]);
    useSocketSetup(setFriendsList);
  return (
    <FriendContext.Provider value={{friendsList, setFriendsList}}>
    <Grid templateColumns="repeat(10, 1fr)" h="100vh" as={Tabs}>
        <GridItem colSpan="3" borderRight={"1px solid gray"}>
            <Sidebar />
        </GridItem>
        <GridItem colSpan="7">
            <Chat />
        </GridItem>
    </Grid>
    </FriendContext.Provider>

  )
}

export default Home;