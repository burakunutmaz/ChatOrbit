import { TabPanel, TabPanels, VStack, Text } from '@chakra-ui/react'
import React from 'react'
import { useEffect } from 'react'
import { useContext, useRef } from 'react'
import ChatBox from './ChatBox'
import { FriendContext, MessagesContext } from './Home'

const Chat = ({userid}) => {
    const {friendsList} = useContext(FriendContext);
    const { messages } = useContext(MessagesContext);
    const bottomDiv = useRef(null);

    useEffect(() => {
        bottomDiv.current?.scrollIntoView();
    }, [])

    if (friendsList.length > 0) {return (
    <VStack h={"100%"} justify="end">
        <TabPanels overflowY={"scroll"}>
            {friendsList.map(friend => (
                    <VStack flexDir={"column-reverse"}
                        as={TabPanel}
                        key={`chat:${friend.username}`} w="100%"
                    >
                    <div ref={bottomDiv} />
                    {messages.filter(
                        msg => msg.to === friend.userid || msg.from === friend.userid)
                        .map((message, idx) => (
                            <Text 
                                key={`msg:${friend.username}.${idx}`}
                                fontSize="lg"
                                bg={message.to === friend.userid ? "purple.100" : "gray.100"}
                                color="gray.800"
                                borderRadius={"10px"}
                                p="0.5rem 1rem"
                                m={message.to === friend.userid ? "1rem 0 0 auto !important" : "1rem auto 0 0 !important"}
                                maxWidth="50%">
                                    {message.content}
                            </Text>
                        ))}
    
                    </VStack>
                )
            )}
        </TabPanels>
        <ChatBox userid={userid} />
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