import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Question } from "./Question";
import ErrorPage from "../ErrorPage/ErrorPage";

const QuizPage = () => {
  const [selectedIndex, setSelectedIndex] = useState([]);
  const [updatedQuestionList, setUpdatedQuestionList] = useState([]);

  const [questionNum, setQuestionNum] = useState(0);
  const location = useLocation();
  const { quizData: questions } = location.state || {};

  const navigate = useNavigate();

  const calculateScore = async () => {
    let score = 0;
    const updatedList = [...updatedQuestionList];

    await questions.map((question, index) => {
      const correctAnsIndex = question.options.indexOf(question.correctAnswer);
      const userInputIndex = selectedIndex[Number(question.serial_number) - 1];

      const isCorrect = correctAnsIndex == userInputIndex;

      if (isCorrect) score += 1;

      console.log("----", correctAnsIndex);
      console.log("---", userInputIndex);
      console.log("--", isCorrect);

      const updatedObject = { ...question, correctAnsIndex, userInputIndex };

      updatedList[index] = updatedObject;
    });
    setUpdatedQuestionList(updatedList);
    console.log("updatedQuestionList", updatedQuestionList);
    console.log("Score", score);

    navigate("/response-history", { state: { questions: updatedList, score } });
  };

  return (
    <div
      className={`${
        questions
          ? "flex items-start flex-col pt-2 lg:items-center lg:justify-center lg:pt-20"
          : "flex flex-col items-center justify-center h-screen"
      }`}
    >
      {questions ? (
        <Question
          question={questions[questionNum]}
          questionNum={questionNum}
          setQuestionNum={setQuestionNum}
          upperLimit={questions.length}
          lowerLimit={0}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          calculateScore={calculateScore}
        />
      ) : (
        <ErrorPage />
      )}
    </div>
  );
};

export default QuizPage;
