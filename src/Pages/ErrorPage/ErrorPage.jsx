import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { msg } = location.state || {};

  return (
    <div className="flex flex-col items-center justify-start h-full w-full ">
      <div className="text-2xl font-bold italic text-center mt-32 px-4 text-error animate-pulse">
        {!msg && "Problem Generating the Quiz"}
        {msg}
      </div>
      <div className="text-2xl font-bold italic text-center">
        Kindly Try Again
      </div>
      <button
        className="btn bg-slate-700 text-gray-200 m-5"
        onClick={() => {
          
          navigate("/");
        }}
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorPage;
