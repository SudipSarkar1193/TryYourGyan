import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import "./authForm.css";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { backendServer } from "../../backendServer";
import { signInWithGoogleAndGetUserInfo } from "../../FireBase/firebase";
import { LoaderWithText } from "../Common/LoaderWithText";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Login Mutation
  const {
    mutate: login,
    isError,
    isLoading,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({ usernameOrEmail, password }) => {
      const res = await fetch(`${backendServer}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ identifier: usernameOrEmail, password }),
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        let errorMessage;

        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          errorMessage = errorData.errorMessage || "Unknown error";
        } else {
          errorMessage = await res.text();
        }

        throw new Error(errorMessage);
      }

      return await res.json();
    },
    onSuccess: async (jsonRes) => {
      localStorage.setItem("accessToken", jsonRes.data.access_token);
      localStorage.setItem("refreshToken", jsonRes.data.refresh_token);
      localStorage.setItem("username", jsonRes.data.username);

      toast.success(jsonRes.data.message);
      await queryClient.invalidateQueries({ queryKey: ["userAuth"] });
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Google Sign-In Mutation
  const {
    mutate: signInWithGoogle,
    isLoading: isGoogleLoading,
    isPending: isGooglePending,
  } = useMutation({
    mutationFn: async ({userInfo, token}) => {
      

      const response = await fetch(`${backendServer}/api/users/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(userInfo),
      });

      if (!response.ok) {
        // Try to get the error as JSON, or fallback to plain text
        let errorMessage;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          //⭐⭐ Bcz if I'm direcly sending a text response from Go backend using http.Error() function , the conten-type will be "text/plain; charset=utf-8" not application/json

          const errorData = await response.json();

          errorMessage =
            errorData.errorMessage || errorData.body || "Unknown JSON error";
        } else {
          errorMessage = await response.text(); // Read as plain text
        }

        console.error(`Error: ${errorMessage} (status: ${response.status})`);

        throw new Error(errorMessage);
      }

      return await response.json();
    },
    onSuccess: async (jsonRes) => {
      
      localStorage.setItem("accessToken", jsonRes.data.access_token);
      localStorage.setItem("refreshToken", jsonRes.data.refresh_token);
      localStorage.setItem("username", jsonRes.data.username);

      await queryClient.invalidateQueries({ queryKey: ["userAuth"] });
      navigate("/");
    },
    onError: (error) => {
      console.log(error)
      toast.error(`Error: ${error.message}`);
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

  const handleSignInWithGoogle = async () => {
    try {
      const { userInfo, token } = await signInWithGoogleAndGetUserInfo();
      
      signInWithGoogle({userInfo, token});
    } catch (error) {
      toast.error("Google Sign-In failed");
    }
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
            value={formData.usernameOrEmail}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <button className="sign mt-5 transition-transform duration-150 active:scale-105">
          {isLoading || isPending ? (
            <LoaderWithText text={"Authenticating..."} />
          ) : (
            "Log in"
          )}
        </button>
      </form>

      <div className="social-message">
        <div className="line" />
        <p className="message">or</p>
        <div className="line" />
      </div>

      <div className="flex justify-center">
        <button
          aria-label="Log in with Google"
          onClick={handleSignInWithGoogle}
          className="bg-btnColor text-btnTextColor font-semibold rounded-lg p-2 w-full my-3 transition-transform duration-150 active:scale-105"
        >
          {isGoogleLoading ? (
            <LoaderWithText text="Authenticating..." />
          ) : (
            <>
              Sign in with <FcGoogle size={25} className="inline-block" />
            </>
          )}
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
