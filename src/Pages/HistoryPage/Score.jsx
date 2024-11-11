// QuizBanner.js (React Component)
import React from "react";
import "./QuizBanner.css"; // Import the CSS

const Score = ({ score, total }) => {
  return (
    <div className="scorebox">
      <div className="separator"></div> {/* Horizontal line */}
      <div className="score-text-top">
        <strong className="text-lg font-medium">{score}</strong> {/* Score */}
      </div>
      <div className="score-text-bottom">
        <strong className="text-lg font-medium">{total}</strong> {/* Total */}
      </div>
    </div>
  );
};

export default Score;
