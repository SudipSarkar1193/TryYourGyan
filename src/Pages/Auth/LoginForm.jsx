import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import "./authForm.css";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { backendServer } from "../../backendServer";
import { auth, provider } from "../../utils/firebase";
import { LoaderWithText } from "../Common/LoaderWithText";
import { storeToken } from "../../utils/tokenManagement";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [isResending, setIsResending] = useState(false); // State for resend logic

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: resendOTP } = useMutation({
    mutationFn: async () => {
      setIsResending(true);
      const response = await fetch(`${backendServer}/api/users/auth/newotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("verifyToken")}`,
        },
      });

      setIsResending(false);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to send OTP");
      }

      const jsonRes = await response.json();

      return 1;
    },
    onSuccess: () => {
      navigate("/verify");
    },
    onError: (error) => {
      toast.error(error.message, {
        style: { backgroundColor: "white", color: "black" },
      });
    },
  });

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
      storeToken(jsonRes.data.access_token, jsonRes.data.refresh_token);
      localStorage.setItem("username", jsonRes.data.username);

      localStorage.setItem("verifyToken", jsonRes.data.verify_token);

      if (jsonRes.data.isNotVarified) {
        toast.info("Please verify your email first", {
          style: {
            backgroundColor: "white", // Customize the background color
            color: "black", // Customize the text color
          },
        });

        resendOTP();

        return;
      }
      toast.success(jsonRes.message, {
        style: {
          backgroundColor: "white", // Customize the background color
          color: "black", // Customize the text color
        },
      });
      await queryClient.invalidateQueries({ queryKey: ["userAuth"] });
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message, {
        style: {
          backgroundColor: "white", // Customize the background color
          color: "black", // Customize the text color
        },
      });
    },
  });

  // Google Sign-In Mutation
  const {
    mutate: signInWithGoogle,
    isLoading: isGoogleLoading,
    isPending: isGooglePending,
  } = useMutation({
    mutationFn: async ({ userInfo, token }) => {
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
      storeToken(jsonRes.data.access_token, jsonRes.data.refresh_token);

      localStorage.setItem("username", jsonRes.data.username);
      toast.success(jsonRes.message, {
        style: {
          backgroundColor: "white", // Customize the background color
          color: "black", // Customize the text color
        },
      });
      await queryClient.invalidateQueries({ queryKey: ["userAuth"] });
      navigate("/");
    },
    onError: (error) => {
      console.error(error);
      toast.error(`Error: ${error.message}`, {
        style: {
          backgroundColor: "white", // Customize the background color
          color: "black", // Customize the text color
        },
      });
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
      let result;
      try {
        console.log("Point 1: Before signInWithPopup");
        result = await signInWithPopup(auth, provider);
        console.log("Point 2: After signInWithPopup");
      } catch (error) {
        console.error("Error in signInWithPopup:", error);
      }
      const isNewUser = result?._tokenResponse?.isNewUser;
      if (isNewUser) {
        console.log("New User");
      } else {
        console.log("Existing User");
      }

      const user = result?.user;
      const userInfo = user
        ? {
            username: user.displayName,
            email: user.email,
            profileImg: user.photoURL,
            firebaseId: user.uid,
            isNewUser,
          }
        : {};

      const token =
        (await result?._tokenResponse?.idToken) || (await user?.getIdToken());

      signInWithGoogle({ userInfo, token });
    } catch (error) {
      console.error("Firebase : ", error);
      toast.error("Google Sign-In failed", {
        style: {
          backgroundColor: "white", // Customize the background color
          color: "black", // Customize the text color
        },
        autoClose: 5700,
      });
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

        <button className="sign mt-5 transition-transform duration-150 active:scale-105 w-1/2">
          {isLoading || isPending ? (
            <LoaderWithText text={"Authenticating..."} />
          ) : (
            "Log in"
          )}
        </button>
      </form>

      <p className="signup my-2">Don&apos;t have an account?</p>

      <button
        className="sign  transition-transform duration-150 active:scale-105 w-1/2"
        onClick={() => navigate("/signup")}
      >
        Create new account
      </button>

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
          {isGoogleLoading || isGooglePending ? (
            <LoaderWithText text="Authenticating..." />
          ) : (
            <>
              Sign in with <FcGoogle size={25} className="inline-block" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
