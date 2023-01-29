import { Button, Heading, Modal,
        ModalBody, ModalCloseButton,
        ModalContent, ModalFooter,
        ModalHeader, ModalOverlay } from '@chakra-ui/react'
import { Form, Formik } from 'formik';
import React from 'react'
import TextField from '../TextField';
import * as Yup from "yup";
import socket from '../../socket';
import { useState } from 'react';
import { useCallback } from 'react';
import { useContext } from 'react';
import { FriendContext } from './Home';



const AddFriendModal = ({isOpen, onClose}) => {

    const {setFriendsList} = useContext(FriendContext);

    const [err, setErr] = useState("");
    const closeModal = useCallback(
        () => {
            setErr("");
            onClose();
        }, [onClose]
    )
  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered="true">
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Add a friend!</ModalHeader>
            <ModalCloseButton onClick={() => {onClose(); window.location.reload(false);}} />
            <Formik initialValues={{friendName: ""}}
                    validationSchema= {Yup.object({
                        friendName: Yup.string()
                                    .required("Friend name is required")
                                    .min(6, "Name is invalid.")
                                    .max(28, "Friend name is too long."),
                    })}
                    onSubmit={(values, actions) => {
                        socket.emit("add_friend", values.friendName, ({err, done, newFriend}) => {
                            if (done){
                                setFriendsList(c => [newFriend , ...c]);
                                closeModal();
                                actions.resetForm();
                                window.location.reload(false);
                                return;
                            } else {
                                setErr(err);
                            }
                        })

                    }}>
                <Form>
                    <ModalBody>
                    <Heading as={"p"} fontSize="lg" color="red.500" textAlign={"center"}>{err}</Heading>
                    <TextField label="Friend's name:" placeholder="Enter a friend's name..."
                                autoComplete="off" name="friendName" />
                    </ModalBody>
                <ModalFooter>
                    <Button type='submit' colorScheme={"purple"}> 
                        Submit
                    </Button>    
                </ModalFooter>   
                </Form>
            </Formik>
        </ModalContent>
    </Modal>
  );
};

export default AddFriendModal