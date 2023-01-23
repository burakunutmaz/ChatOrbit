import { Route, Routes } from "react-router-dom"
import SignIn from './Login/SignIn';
import SignUp from "./Login/SignUp";

export const Views = () => {
  return (
    <Routes>
        <Route path="/" element={<SignIn/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="*" element={<SignIn/>} />
    </Routes>
  )
}
