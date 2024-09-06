import React, { useState } from "react";

import { FcGoogle } from "react-icons/fc";

import "./authForm.css";
import { backendServer } from "../../backendServer";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const navigate = useNavigate();

  const {
    mutate: signup,
    isError,
    isPending,
  } = useMutation({
    mutationFn: async ({ email, username, password }) => {
      try {
        console.log("+++", username, email, password);
        const res = await fetch(`${backendServer}/api/auth/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ username, email, password }),
        });
        const resData = await res.json();
        if (!res.ok)
          throw new Error(resData.message || "Failed to create account");

        return { resData, username };
      } catch (error) {
        throw error;
      }
    },
    onSuccess: ({ resData, username }) => {
      toast.success(`Welcome ${username}`);
      navigate("/login");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
  });

  return (
    <div className="form-container">
      <p className="title">Sign up</p>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          console.log("formData", formData);
          signup(formData);
        }}
      >
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder=""
            onChange={handleInputChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder=""
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
            onChange={handleInputChange}
          />
        </div>

        <button
          className="sign  outline outline-1 outline-slate-600 mt-5"
          onChange={handleInputChange}
        >
          Sign up
        </button>
      </form>

      <p className="signup mt-5">
        Alraedy have an account?
        <a rel="noopener noreferrer" href="#" className="ml-2">
          Sign in
        </a>
      </p>
    </div>
  );
};

export default RegisterForm;
