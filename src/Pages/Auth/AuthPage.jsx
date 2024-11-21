import React from "react";
import Banner from "../Common/Banner";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "./customAuth.css"
const AuthPage = ({ isLoginPage = true }) => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-evenly w-full custom-class gap-4 lg:gap-0">
      {isLoginPage && <LoginForm />}
      {!isLoginPage && <RegisterForm />}
    </div>
  );
};

export default AuthPage;
