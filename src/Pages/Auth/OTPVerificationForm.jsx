import React, { useRef, useState } from "react";
import "./authForm.css";
import { useMutation } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { backendServer } from "../../backendServer";
import { LoaderWithText } from "../Common/LoaderWithText";
import Timer from "../Common/Timer";

const OTPVerificationForm = () => {
  //For Timer:

  const timerRef = useRef();

  const navigate = useNavigate();
  const handleTimerEnd = () => {
    toast.error("OOPS😓Time out", {
      style: {
        backgroundColor: "white", // Customize the background color
        color: "black", // Customize the text color
      },
    });
    navigate("/");
  };

  const restartTheTimer = () => {
    if (timerRef.current) {
      timerRef.current.restartTimer();
    }
  };

  const [otp, setOtp] = useState(""); // State for OTP input
  const [isResending, setIsResending] = useState(false); // State for resend logic

  // Mutation for verifying the OTP
  const { mutate: verifyOTP, isPending: isVerifying } = useMutation({
    mutationFn: async (otp) => {
      const response = await fetch(`${backendServer}/api/users/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("verifyToken")}`,
        },
        body: JSON.stringify({ otp }),
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg || "Failed to verify OTP");
      }
      const jsonData = await response.json();

      return jsonData;
    },
    onSuccess: () => {
      toast.success("Email verified successfully!", {
        style: { backgroundColor: "white", color: "black" },
      });
      navigate("/"); // Navigate to the home page or dashboard after verification
    },
    onError: (error) => {
      toast.error(error.message, {
        style: { backgroundColor: "white", color: "black" },
      });
    },
  });

  // Mutation for resending the OTP
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
        throw new Error(errorData || "Failed to resend OTP");
      }
      const jsonRes = await response.json();

      return jsonRes;
    },
    onSuccess: (res) => {
      toast.success(res.message || "OTP has been resent to your email!", {
        style: { backgroundColor: "white", color: "black" },
      });
      restartTheTimer();
    },
    onError: (error) => {
      toast.error(error.message, {
        style: { backgroundColor: "white", color: "black" },
      });
    },
  });

  // Handle OTP input change
  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow numeric input
    setOtp(value.slice(0, 4)); // Limit to 4 digits
  };

  // Handle OTP submission
  const handleVerify = (e) => {
    e.preventDefault();
    if (otp.length === 4) {
      verifyOTP(otp);
    } else {
      toast.error("Please enter a valid 4-digit OTP", {
        style: { backgroundColor: "white", color: "black" },
      });
    }
  };

  return (
    <div className="custom-classs w-full  flex items-center justify-center text-center">
      <div className="form-container">
        <p className="title">Verify OTP</p>
        <p className="subtitle">
          An OTP has been sent to your registered email address.
        </p>
        <form className="form" onSubmit={handleVerify}>
          <div className="input-group">
            <label htmlFor="otp">Enter OTP</label>
            <input
              type="text"
              name="otp"
              id="otp"
              value={otp}
              onChange={handleInputChange}
              maxLength={4}
              placeholder="Enter 4-digit OTP"
              className="text-center"
            />
          </div>
          <button
            type="submit"
            className="sign my-5 transition-transform duration-150 active:scale-105"
            disabled={isVerifying}
          >
            {isVerifying ? <LoaderWithText text="Verifying..." /> : "Verify"}
          </button>
        </form>
        <div className="w-full h-5 flex justify-center items-center text-xs">
          The OTP is valid for{" "}
          <Timer ref={timerRef} onTimerEnd={handleTimerEnd} />
        </div>
        <div className="social-message">
          <div className="line" />
          <p className="message">or</p>
          <div className="line" />
        </div>

        <p className="signup">
          Didn&apos;t get the email?
          <span
            className="ml-2 hover:cursor-pointer hover:underline underline-offset-2 active:cursor-pointer active:underline "
            onClick={() => {
              resendOTP();
            }}
          >
            {isResending ? (
              <LoaderWithText text="Resending..." />
            ) : (
              "send again"
            )}
          </span>
        </p>
      </div>
    </div>
  );
};

export default OTPVerificationForm;
