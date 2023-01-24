import { TabPanel, TabPanels, VStack } from '@chakra-ui/react'
import React from 'react'
import { useContext } from 'react'
import { FriendContext } from './Home'

const Chat = () => {
    const {friendsList, setFriendsList} = useContext(FriendContext);
    if (friendsList.length > 0) {return (
    <VStack>
        <TabPanels>
            <TabPanel>friend one</TabPanel>
            <TabPanel>friend two</TabPanel>
        </TabPanels>
    </VStack>
  )} else {
    return (
        <VStack justify={"center"} w="100vh" textAlign={"center"} fontSize="lg">
            <TabPanels>
                <TabPanel>Add a friend to start chatting!</TabPanel>
            </TabPanels>
        </VStack>
    )

  }
}

export default Chat