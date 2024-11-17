import React from "react";

import "./scorecard.css";
import { useNavigate } from "react-router-dom";
const ScoreCard = ({ score, total }) => {
  const formatNumber = (num) => {
    // Check if the number has decimal places
    return num % 1 === 0 ? num : num.toFixed(2);
  };

  const navigate = useNavigate();

  const text = (num) => {
    if (num <= 20) return ["Not Bad😅", "keep trying😄"];
    else if (num > 20 && num < 60) return ["Good👍", "Keep it up😀"];
    else if (num >= 60 && num < 80) return ["Very Good✅"];
    else return ["Excellent🔥🔥"];
  };

  return (
    <div className="results-summary-container">
      <div className="confetti">
        <div className="confetti-piece" />
        <div className="confetti-piece" />
        <div className="confetti-piece" />
        <div className="confetti-piece" />
        <div className="confetti-piece" />
        <div className="confetti-piece" />
        <div className="confetti-piece" />
        <div className="confetti-piece" />
        <div className="confetti-piece" />
        <div className="confetti-piece" />
        <div className="confetti-piece" />
        <div className="confetti-piece" />
        <div className="confetti-piece" />
        <div className="confetti-piece" />
        <div className="confetti-piece" />
        <div className="confetti-piece" />
        <div className="confetti-piece" />
        <div className="confetti-piece" />
        <div className="confetti-piece" />
      </div>
      <div className="results-summary-container__result">
        <div className="heading-tertiary">Your Result</div>
        <div className="result-box">
          <div className="heading-primary">{score}</div>
          <p className="text-2xl font-bold text-gray-400">{total}</p>
        </div>
        <div className="w-full flex items-center justify-center flex-col">
          <div className="heading-secondary text-center">
            {text(formatNumber(score / total) * 100)[0]}
            <br />
            {text(formatNumber(score / total) * 100).length > 1 &&
              text(formatNumber(score / total) * 100)[1]}
          </div>
          <p className="font-lg text-xl para">
            You scored {formatNumber(score / total) * 100}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
