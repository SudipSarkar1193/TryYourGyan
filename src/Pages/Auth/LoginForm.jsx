import React, { useState } from "react";

import { FcGoogle } from "react-icons/fc";

import "./authForm.css";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { backendServer } from "../../backendServer";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    mutate: login,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({ usernameOrEmail, password }) => {
      try {
        const res = await fetch(`${backendServer}/api/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ identifier: usernameOrEmail, password }),
        });

        if (!res.ok) {
          let errorMessage;
          const contentType = res.headers.get("content-type");

          if (contentType && contentType.includes("application/json")) {
            const errorData = await res.json();
            errorMessage =
              errorData.errorMessage || errorData.body || "Unknown JSON error";
          } else {
            errorMessage = await res.text();
          }

          console.error(`Error: ${errorMessage} (status: ${res.status})`);

          throw new Error(errorMessage);
        }

        const jsonRes = await res.json();

        return jsonRes;
      } catch (error) {
        error;
        throw error;
      }
    },
    onSuccess: async (jsonRes) => {
      console.log(jsonRes)
      localStorage.setItem("accessToken", jsonRes.data.access_token);
      localStorage.setItem("refreshToken", jsonRes.data.refresh_token);
      localStorage.setItem("username", jsonRes.data.usename);

      toast.success(jsonRes.message);
      
      await queryClient.invalidateQueries({ queryKey: ["userAuth"] });
      navigate("/");
    },
    onError: (error) => {
      console.error(error);

      toast.error(error.message);
    },
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    login(formData);
  };

  return (
    <div className="form-container">
      <p className="title">Login</p>
      <form className="form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">Username/email</label>
          <input
            type="text"
            name="usernameOrEmail"
            id="usernameOrEmail"
            placeholder=""
            value={formData.usernameOrEmail}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder=""
            value={formData.password}
            onChange={handleInputChange}
          />

          {/* <div className="forgot">
            <a rel="noopener noreferrer" href="#">
              Forgot Password ?
            </a>
          </div> */}
        </div>
        <button className="sign  outline outline-1 outline-slate-600 mt-5">
          Sign in
        </button>
      </form>
      <div className="social-message">
        <div className="line" />
        <p className="message">or</p>
        <div className="line" />
      </div>
      <div className=" flex justify-center">
        <button
          aria-label="Log in with Google"
          className="bg-btnColor text-btnTextColor font-semibold rounded-lg p-2 text-lg w-full outline outline-1 outline-slate-600 my-3"
        >
          sign in with <FcGoogle size={25} className="inline-block" />
        </button>
      </div>
      <p className="signup">
        Don&apos;t have an account?
        <span className="ml-2" onClick={() => navigate("/signup")}>
          Sign up
        </span>
      </p>
    </div>
  );
};

export default LoginForm;
