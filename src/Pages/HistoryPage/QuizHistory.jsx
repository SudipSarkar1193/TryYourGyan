import React, { useContext, useEffect, useState } from "react";
import QuizBanner from "./QuizBanner";
import { backendServer } from "../../backendServer";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Loader2 from "../Common/Loader2";
import LoadingSpinner from "../Common/LoadingSpinner";
import { AppContext } from "../../Context/AppContextProvider";

const QuizHistory = () => {
  //
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { state, setState } = useContext(AppContext);

  //
  const getQuizData = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch(`${backendServer}/api/quiz/quizzes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch quizzes");
      }

      const data = await response.json();

      setState({ ...state, quizData: data.data || [] });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch quiz data when the component mounts
  useEffect(() => {
    getQuizData();
  }, []);

  const { data: userAuth, isLoading: authLoading } = useQuery({
    queryKey: ["userAuth"],
  });

  // Show loading screen if user authentication is still loading
  if (authLoading) {
    return (
      <div className="w-full min-h-[80%] flex flex-col items-center justify-start bg-inherit overflow-hidden gap-6 ">
        <div className="text-2xl font-bold italic text-center mt-28 lg:mt-40">
          Checking Authentication status...
        </div>
        <div className="text-2xl font-bold italic text-center">
          <div className="w-full flex justify-center ">
            {" "}
            <span>Please Wait</span> <Loader2 />
          </div>
        </div>
        <LoadingSpinner />
      </div>
    );
  }

  return userAuth ? (
    <div className="min-h-[80%] bg-gradient-to-br from-black to-[#140125] flex justify-center items-center py-4">
      <div className="w-full max-w-5xl space-y-6">
        {loading ? (
          <div className="w-full  max-h-full flex flex-col items-center justify-start bg-inherit overflow-hidden gap-6">
            <div className="text-2xl font-bold italic text-center mt-28 lg:mt-40">
              {`Quizzes are being loaded for you,`}
              <br />
              {` ${localStorage.getItem("username") || ""} 😄`}
            </div>
            <div className="text-2xl font-bold italic text-center">
              <div className="w-full flex justify-center ">
                {" "}
                <span>Please Wait</span> <Loader2 />
              </div>
            </div>
            <LoadingSpinner />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : state?.quizData.length === 0 ? (
          <div className="w-full h-full flex justify-center items-center flex-col">
            <p className="text-2xl font-bold italic text-center ">
              No quizzes available.
            </p>
            <button className="btn" onClick={() => navigate("/")}>
              Back to the Home page
            </button>
          </div>
        ) : (
          state?.quizData.map((quiz) => (
            <div
              key={quiz.id} // Use key on the outermost element
              className="cursor-pointer"
            >
              <QuizBanner
                title={quiz.quiz_name}
                score={quiz.score}
                totalQuestions={quiz.totalQuestions}
                level={quiz.level}
                id={quiz.id}
                date={quiz.created_at}
                getQuizData={getQuizData}
              />
            </div>
          ))
        )}
      </div>
    </div>
  ) : (
    <div className="h-full w-full flex justify-center items-center">
      <button
        className="max-w-full btn outline outline-1 outline-slate-600 mt-1"
        onClick={() => navigate("/login")}
      >
        Please Log in First
      </button>
    </div>
  );
};

export default QuizHistory;
