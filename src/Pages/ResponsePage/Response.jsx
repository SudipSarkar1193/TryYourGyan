import React from "react";
import { ResponseQuestion } from "./ResponseQuestion";
import { useLocation } from "react-router-dom";
import ScoreCard from "./ScoreCard";

const Response = () => {
  const location = useLocation();
  const { questions, score } = location.state || {};
  return (
    <div className="min-h-screen w-screen overflow-x-hidden app ">
      {/* <div className="h-20 w-full flex items-center justify-center mt-14 mb-10 ">
        <span className="ring ring-green-400 text-4xl font-bold p-5 rounded-full text-blue-600">
          <span>{score}</span>/<span>{questions.length}</span>
        </span>
      </div> */}
      <div className="w-full  overflow-x-hidden flex items-center justify-center">
        {" "}
        <ScoreCard score={score} total={questions.length} />
      </div>
        <div className="text-xl font-bold italic text-center">Your Response History : </div>
      {questions.map((question, index) => (
        <ResponseQuestion question={question} />
      ))}
    </div>
  );
};

export default Response;
