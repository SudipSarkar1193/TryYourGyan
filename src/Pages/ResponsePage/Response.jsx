import React, { useEffect } from "react";
import { ResponseQuestion } from "./ResponseQuestion";
import { useLocation } from "react-router-dom";
import ScoreCard from "./ScoreCard";
import { useMutation } from "@tanstack/react-query";
import { backendServer } from "../../backendServer";

const Response = () => {
  const location = useLocation();
  const { questions, score, quiz_id } = location.state || {};
  const accessToken = localStorage.getItem("accessToken");

  return (
    <div className="min-h-screen w-screen overflow-x-hidden app">
      <div className="w-full overflow-x-hidden flex items-center justify-center">
        <ScoreCard score={score} total={questions.length} />
      </div>
      <div className="text-xl font-bold italic text-center">
        Your Response History:
      </div>
      {questions.map((question, index) => (
        <ResponseQuestion key={index} question={question} />
      ))}
    </div>
  );
};

export default Response;
