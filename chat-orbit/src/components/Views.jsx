import { Text } from "@chakra-ui/react";
import { useContext } from "react";
import { Route, Routes } from "react-router-dom"
import { AccountContext } from "./AccountContext";
import Home from "./Home/Home";
import SignIn from './Login/SignIn';
import SignUp from "./Login/SignUp";
import PrivateRoutes from "./PrivateRoutes";

export const Views = () => {
  const {user} = useContext(AccountContext);
  return user.loggedIn === null ? (<Text>Loading...</Text>) : (
    <Routes>
        <Route path="/" element={<SignIn/>} />
        <Route path="/signup" element={<SignUp/>} />
        
        <Route element={<PrivateRoutes/>}>
          <Route path="/home" element={<Home/>} />
        </Route>
    </Routes>
  )
}
