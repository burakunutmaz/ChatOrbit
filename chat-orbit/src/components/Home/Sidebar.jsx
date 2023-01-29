import { ChatIcon } from '@chakra-ui/icons'
import { Text, Button, Divider, Heading, HStack, Tab, TabList, VStack, Circle, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { useContext } from 'react'
import AddFriendModal from './AddFriendModal'
import { FriendContext } from './Home'

const Sidebar = () => {
    const {friendsList} = useContext(FriendContext);
    const {isOpen, onOpen, onClose} = useDisclosure();

    return (
    <div>
    <VStack py={"1.3rem"}>
        <HStack justify={"space-evenly"} w="100%">
            <Heading size={"md"}>Add Friend</Heading>
            <Button onClick={onOpen}>
                <ChatIcon/>
            </Button>
        </HStack>
        <Divider/>
        <VStack as={TabList}>
            {friendsList.map(friend => (
                <HStack key={`friend:${friend.username}`} as={Tab}>
                    <Text>{friend.username}</Text>
                    <Circle background={friend.connected ? "green.500" : "gray.500"}
                            w="10px" h="10px"/>
                </HStack>
            ))}
        </VStack>
    </VStack>
    <AddFriendModal isOpen={isOpen} onClose={onClose} />
    </div>
  )
}

export default Sidebar