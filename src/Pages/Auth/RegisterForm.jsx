import React, { useState } from "react";

import { FcGoogle } from "react-icons/fc";

import "./authForm.css";
import { backendServer } from "../../backendServer";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { LoaderWithText } from "../Common/LoaderWithText";
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    isLoading,
  } = useMutation({
    mutationFn: async ({ email, username, password }) => {
      try {
        const res = await fetch(`${backendServer}/api/users/new`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ username, email, password }),
        });

        if (!res.ok) {
          // Try to get the error as JSON, or fallback to plain text
          let errorMessage;
          const contentType = res.headers.get("content-type");

          if (contentType && contentType.includes("application/json")) {
            //⭐⭐ Bcz if I'm direcly sending a text response from Go backend using http.Error() function , the conten-type will be "text/plain; charset=utf-8" not application/json

            const errorData = await res.json();

            errorMessage =
              errorData.errorMessage || errorData.body || "Unknown JSON error";
          } else {
            errorMessage = await res.text(); // Read as plain text
          }

          console.error(`Error: ${errorMessage} (status: ${res.status})`);

          throw new Error(errorMessage);
        }

        const resData = await res.json();

        return { resData, username };
      } catch (error) {
        throw error;
      }
    },
    onSuccess: ({ resData, username }) => {
      localStorage.setItem("verifyToken", resData.data.verify_token);
      toast.success(`Welcome ${username}`, {
        style: {
          backgroundColor: "white", // Customize the background color
          color: "black", // Customize the text color
        },
      });
      navigate("/verify");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message, {
        style: {
          backgroundColor: "white", // Customize the background color
          color: "black", // Customize the text color
        },
      });
    },
  });

  return (
    <div className="form-container">
      <p className="title">Sign up</p>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          const { username, email, password, confirmPassword } = formData;

          if (!(username && email && password && confirmPassword)) {
            toast.error("All fields are required", {
              style: {
                backgroundColor: "white", // Customize the background color
                color: "black", // Customize the text color
              },
            });
            return;
          }
          if (password !== confirmPassword) {
            toast.error("password mismatched. Don't hurry typing", {
              style: {
                backgroundColor: "white", // Customize the background color
                color: "black", // Customize the text color
              },
            });
            return;
          }

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

        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder=""
            onChange={handleInputChange}
          />
        </div>

        <button
          className="sign  outline outline-1 outline-slate-600 mt-5 transition-transform duration-150 active:scale-105"
          onChange={handleInputChange}
        >
          {isLoading || isPending ? (
            <LoaderWithText text={"Signing up..."} />
          ) : (
            "Sign up"
          )}
        </button>
      </form>

      <p className="signup mt-5">
        Alraedy have an account?
        <a
          rel="noopener noreferrer"
          href="#"
          className="ml-2 transition-transform duration-150 active:scale-105"
          onClick={() => navigate("/login")}
        >
          Sign in
        </a>
      </p>
    </div>
  );
};

export default RegisterForm;
