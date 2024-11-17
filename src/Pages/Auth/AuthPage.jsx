import React from "react";
import Banner from "../Common/Banner";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthPage = ({ isLoginPage = true }) => {
  return (
    <div className="flex flex-col lg:flex-row items-center lg:justify-evenly w-full h-[85%] gap-4 lg:gap-0">
      {isLoginPage && <LoginForm />}
      {!isLoginPage && <RegisterForm />}
    </div>
  );
};

export default AuthPage;
