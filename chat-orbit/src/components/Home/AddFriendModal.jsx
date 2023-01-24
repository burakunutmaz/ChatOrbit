import { Button, Modal,
        ModalBody, ModalCloseButton,
        ModalContent, ModalFooter,
        ModalHeader, ModalOverlay } from '@chakra-ui/react'
import { Form, Formik } from 'formik';
import React from 'react'
import TextField from '../TextField';
import * as Yup from "yup";



const AddFriendModal = ({isOpen, onClose}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered="true">
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
                        onClose();
                        actions.resetForm();
                        window.location.reload(false);
                    }}>
                <Form>
                    <ModalBody>
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