import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Question } from "./Question";
import ErrorPage from "../ErrorPage/ErrorPage";
import { backendServer } from "../../backendServer";
import { useQuery } from "@tanstack/react-query";
import PopupLoader from "../popup/PopupLoader";
import { toast } from "react-toastify";

const QuizPage = () => {
  const [selectedIndex, setSelectedIndex] = useState([]);
  const [updatedQuestionList, setUpdatedQuestionList] = useState([]);
  const [questionNum, setQuestionNum] = useState(0);
  const [loading, setLoading] = useState(false); // New loading state

  const location = useLocation();
  const {
    quizData: questions,
    topic,
    level,
    totalQuestions,
  } = location.state || {};

  const navigate = useNavigate();
  const { data: userAuth } = useQuery({ queryKey: ["userAuth"] });

  const calculateScore = async () => {
    // Prevent multiple submissions
    if (loading) return;
    setLoading(true);

    let score = 0;
    const updatedList = [...updatedQuestionList];

    questions.forEach((question, index) => {
      const correctAnsIndex = question.options.indexOf(question.correctAnswer);
      const userInputIndex = selectedIndex[Number(question.serial_number) - 1];
      const isCorrect = correctAnsIndex === userInputIndex;

      if (isCorrect) score += 1;

      const updatedObject = {
        ...question,
        correctAnsIndex,
        user_answer: question.options[userInputIndex],
        userInputIndex,
      };
      updatedList[index] = updatedObject;
    });

    setUpdatedQuestionList(updatedList);

    const accessToken = localStorage.getItem("accessToken");

    try {
      // First API call to create a new quiz entry

      const response = await fetch(`${backendServer}/api/quiz/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          quiz_name: topic,
          user_id: +userAuth?.data.id,
          score,
          level,
          totalQuestions,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Quiz creation failed: ${
            response.statusText
          }\n ${await response.text()}`
        );
      }

      const data = await response.json();
      const quiz_id = data?.data.id;

      // Prepare updated questions data
      const updatedQuestions = updatedList.map((question) => ({
        ...question,
        quiz_id: +quiz_id,
        serial_number: parseInt(question.serial_number, 10) || 0,
      }));

      // Second API call to save the questions
      const res = await fetch(`${backendServer}/api/quiz/questions/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedQuestions),
      });

      if (!res.ok) {
        throw new Error(`Questions submission failed: ${res.statusText}`);
      }

      toast.success("Answers submitted successfully", {
        style: {
          backgroundColor: "white", // Customize the background color
          color: "black", // Customize the text color
        },
      });
      // Navigate to response history on success
      navigate("/response-history", {
        state: { questions: updatedList, score },
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return loading ? (
    <PopupLoader text={"Answers are being submitted..."} />
  ) : (
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

      {/* Conditionally render the submit button */}
      <button
        onClick={calculateScore}
        disabled={loading}
        className={`mt-5 px-4 py-2 ${
          loading ? "bg-gray-400" : "bg-blue-600"
        } text-white rounded`}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

export default QuizPage;
