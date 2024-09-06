import React from "react";
import Banner from "../Common/Banner";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useLocation } from "react-router-dom";

const AuthPage = ({ isLoginPage = true }) => {
  const location = useLocation();
  const { setDoneAuth } = location.state 
  return (
    <div className="flex flex-col lg:flex-row items-center lg:justify-evenly w-full h-[85%] gap-4 lg:gap-0">
      {isLoginPage && <LoginForm setDoneAuth={setDoneAuth}/>}
      {!isLoginPage && <RegisterForm />}
    </div>
  );
};

export default AuthPage;
