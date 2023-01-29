import { Button, HStack, Input } from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'
import React from 'react'
import { useContext } from 'react'
import * as Yup from 'yup'
import socket from '../../socket'
import { MessagesContext } from './Home'

const ChatBox = ({userid}) => {
    const {messages, setMessages} = useContext(MessagesContext);
  return (
    <Formik initialValues={{message: ""}}
     validationSchema={Yup.object({
        meesage: Yup.string().min(1).max(255)
     })}
     onSubmit={async (values, actions) => {
        const message = {
            to: userid,
            from: null,
            content: values.message};
        socket.emit("dm", message);
        console.log("BEFORE: MESSAGES: ", messages)
        await setMessages(prevMsgs => {
            console.log(prevMsgs);
            return [message, ...prevMsgs];
        })
        console.log("AFTER: MESSAGES: ", messages)
        console.log(JSON.stringify(message));
        actions.resetForm();
     }}
     >
        <HStack as={Form} w="100%" pb={"1.4rem"} px="1.4rem">
            <Input as={Field} name="message" size={"lg"} placeholder='Type something here to say...' autoComplete="off" />
            <Button type="submit" size={"lg"} colorScheme="purple">Send</Button>
        </HStack>

    </Formik>
  )
}

export default ChatBox