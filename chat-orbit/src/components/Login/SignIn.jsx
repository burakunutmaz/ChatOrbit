import { VStack, ButtonGroup, Button, Heading, Text } from '@chakra-ui/react'
import React from 'react'
import {Form, Formik} from 'formik'
import * as Yup from "yup";
import TextField from '../TextField';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AccountContext } from '../AccountContext';

const SignIn = () => {
    const {setUser } = useContext(AccountContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
  return (
    <Formik 
        initialValues= {{username: "", password: ""}}
        validationSchema = {Yup.object({
            username: Yup.string()
                        .required("Username is required")
                        .min(6, "Username is too short.")
                        .max(28, "Username is too long."),
            password : Yup.string()
                        .required("Password is required")
                        .min(6, "Password is too short.")
                        .max(28, "Password is too long.")
        })}
        onSubmit= {(values, actions) => {
            const vals = {...values}
            fetch("http://localhost:4000/auth/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(vals)
            })
                .then(res => {
                    if (!res || !res.ok || res.status >= 400){
                        return;
                    }
                    return res.json();
                })
                .then(data => {
                    if (!data) return;
                    console.log(data);
                    setUser({...data});
                    if (data.status){
                        setError(data.status);
                    } else if (data.loggedIn){

                        navigate("/home");
                    }
                })
                .catch(err => console.log(err))
            actions.resetForm();
        }}>

            <VStack as={Form} w={{base: "90%", md:"500px"}}
            m="auto" justify="center" h="100vh" spacing="1rem">

                <Heading>
                    Log In
                </Heading>
                <Text as="p" color="red.500">{error}</Text>
                <TextField label="Username" name="username" placeholder="Enter username" autoComplete="off" />
                <TextField type="password" label="Password" name="password" placeholder="Enter password" autoComplete="off" />
                    
                <ButtonGroup paddingTop={"1rem"}>
                    <Button type='submit' colorScheme="teal">Log In</Button>
                    <Button onClick={() => navigate("/signup")} >Sign Up</Button>
                </ButtonGroup>
            </VStack>
    
    </Formik>
  )
}

export default SignIn;
