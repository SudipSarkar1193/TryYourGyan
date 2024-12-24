import React, { useEffect, useState } from "react";
import ScoreCard from "../ResponsePage/ScoreCard";
import { ResponseQuestion } from "../ResponsePage/ResponseQuestion";
import { backendServer } from "../../backendServer";
import { useLocation, useParams } from "react-router-dom";
import Loader2 from "../Common/Loader2";
import LoadingSpinner from "../Common/LoadingSpinner";

const Questions = () => {
  const location = useLocation();
  const { score, totalQuestions } = location.state || {};
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getQuizQuestions = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch(
        `${backendServer}/api/quiz/questions?quizID=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch quizzes");
      }

      const data = await response.json();

      setQuestions(data.data?.questions || []); // Extract the quizzes array from data
      setQuiz(data.data.quiz);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getQuizQuestions();
  }, []);

  return error ? (
    <div>{error}</div>
  ) : loading ? (
    <div className="w-full  max-h-full flex flex-col items-center justify-start bg-inherit overflow-hidden gap-6">
      <div className="text-2xl font-bold italic text-center mt-28 lg:mt-40">
        {`Questions are being loaded for you,`} <br />
        {` ${localStorage.getItem("username")} 😄`}
      </div>
      <div className="text-2xl font-bold italic text-center">
        <div className="w-full flex justify-center ">
          {" "}
          <span>Please Wait</span> <Loader2 />
        </div>
      </div>
      <LoadingSpinner />
    </div>
  ) : (
    <div className="min-h-screen w-screen overflow-x-hidden app">
      <div className="w-full overflow-x-hidden flex items-center justify-center">
        {totalQuestions && score && (
          <ScoreCard score={score} total={totalQuestions} />
        )}
      </div>
      <div className="text-xl font-bold italic text-center mt-5">
        {totalQuestions && score
          ? "Your Response History :"
          : "Response History :"}
      </div>
      <div className="text-lg font-bold italic text-center mt-3">
        {quiz?.quiz_name}
      </div>
      {questions.map((question, index) => (
        <ResponseQuestion key={index} question={question} />
      ))}
    </div>
  );
};

export default Questions;
