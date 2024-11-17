import React, { useState } from "react";
import Banner from "../Common/Banner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Question } from "../QuizPage/Question";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../Common/LoadingSpinner";
import Loader2 from "../Common/Loader2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendServer } from "../../backendServer";

const InputPage = () => {
  const [value, setValue] = useState(5);
  const [difficulty, setDifficulty] = useState("Easy");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const [quizData, setQuizData] = useState(null);

  const navigate = useNavigate();

  const {
    mutate,
    isLoading, // Make sure to destructure isLoading from useMutation
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem("accessToken");

        const res = await fetch(`${backendServer}/api/quiz/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            topic,
            num_questions: value,
            difficulty,
          }),
          credentials: "include",
        });

        if (!res.ok) {
          const errorText = await res.text();
          const errorJsonString = errorText.replace("Error: ", "");
          const errorMessage = JSON.parse(errorJsonString);
          throw errorMessage;
        }

        const jsonRes = await res.json();
        let data = null;
        if (jsonRes)
          data = JSON.parse(jsonRes.data.Candidates[0].Content.Parts);

        setLoading(false);
        return data;
      } catch (error) {
        throw error;
      }
    },
    onError: (error) => {
      console.error("Error:", error);

      navigate("/error", { state: { msg: "Error Generating the Quiz" } });
    },
    onSuccess: (data) => {
      if (data) {
        setQuizData(data);

        // Navigate to QuizPage and pass quizData and other data as state
        if (data[0]?.ok) {
          navigate("/quiz", {
            state: {
              quizData: data[1],
              topic: topic,
              level: difficulty,
              totalQuestions: value,
            },
          });
        } else if (!data[0].ok) {
          navigate("/error", { state: { msg: data[1] } });
        }
      }
      // Navigate to QuizPage with QuizDataProp -- fix it chatGPT
    },
  });

  const {
    data: authUser,
    isLoading: isAuthLoading,
    isError: isAuthError,
    isSuccess: isAuthSuccess,
    error: authError,
  } = useQuery({
    queryKey: ["userAuth"],
    queryFn: async () => {
      // Retrieve the access token from localStorage
      const accessToken = localStorage.getItem("accessToken");

      const res = await fetch(`${backendServer}/api/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Include the access token in the Authorization header
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        const errorJsonString = errorText.replace("Error: ", "");
        const errorMessage = JSON.parse(errorJsonString);
        throw new Error(errorMessage);
      }

      const jsonRes = await res.json();

      return jsonRes;
      
    },
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const handleRangeInputChange = (e) => {
    setValue(Number(e.target.value));
  };

  const handleSelectInputChange = (e) => {
    setDifficulty(e.target.value);
  };

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(); // Trigger the mutation
  };

  if (loading) {
    return (
      <div className="w-full  max-h-full flex flex-col items-center justify-start bg-inherit overflow-hidden gap-6">
        <div className="text-2xl font-bold italic text-center mt-28 lg:mt-40">
          {`Quiz is being generated for you, ${localStorage.getItem(
            "username"
          )} 😄`}
        </div>
        <div className="text-2xl font-bold italic text-center">
          <div className="w-full flex justify-center ">
            {" "}
            <span>Please Wait</span> <Loader2 />
          </div>
        </div>
        <LoadingSpinner />
        <div className="text-xl font-bold text-yellow-600 italic text-center mt-28 lg:mt-40">
          Developed by : Sudip Sarkar
        </div>
      </div>
    );
  }

  return (
    <div className=" flex flex-col lg:flex-row items-center lg:justify-around w-full  h-5/6 gap-4 overflow-hidden app">
      <div className="w-4/6 lg:mt-0 lg:w-[40%] flex items-center justify-center flex-col">
        <div className="w-full m-6 h-8 bg-red flex items-center justify-center text-lg text-center lg:text-2xl lg:mt-16">
          What Topic Would You Like to take the Quiz On?
        </div>
        <form className="form lg:w-[60%]" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="topic"
              id="topic"
              placeholder="Enter the topic..."
              value={topic}
              onChange={handleTopicChange}
            />
          </div>

          <div className="flex flex-col items-center bg-transparent">
            <label
              htmlFor="difficulty"
              className="w-full my-5 text-md lg:text-lg text-center"
            >
              Select Difficulty Level:
            </label>
            <select
              className="p-2 w-full max-w-xs bg-btnColor outline outline-2 outline-slate-600 rounded-md focus:outline-outlineColor1"
              value={difficulty}
              onChange={handleSelectInputChange}
            >
              <option
                value=""
                disabled
                className="bg-btnColor text-btnTextColor text-sm"
              >
                Select Difficulty Level
              </option>
              <option
                value="Easy"
                className="bg-btnColor text-btnTextColor text-sm"
              >
                Easy
              </option>
              <option
                value="Medium"
                className="bg-btnColor text-btnTextColor text-sm"
              >
                Medium
              </option>
              <option
                value="Hard"
                className="bg-btnColor text-btnTextColor text-sm"
              >
                Hard
              </option>
            </select>
            {difficulty && (
              <div className="mt-2 text-md">
                Selected Difficulty Level:{" "}
                <span className="text-orange-400 animate-pulse">
                  {difficulty}
                </span>
              </div>
            )}
          </div>

          <div className=" w-full flex items-center justify-evenly flex-col">
            <label
              htmlFor="number_of_question"
              className="w-full my-5 text-lg text-center lg:text-2xl"
            >
              Select Number of Questions
            </label>
            <input
              type="range"
              name="number_of_question"
              id="number_of_question"
              className="w-10/12"
              min="5"
              max="25"
              value={value}
              onChange={handleRangeInputChange}
            />
            <div className="mt-1 text-lg">{value}</div>
          </div>
          {isAuthSuccess && (
            <button
              type="submit"
              className="btn outline outline-1 outline-slate-600 mt-1"
            >
              Generate Your Quiz
            </button>
          )}
        </form>
        {isAuthLoading && <Loader2 />}{" "}
        {!isAuthSuccess &&
          !isAuthLoading &&
          isAuthError &&
          authError &&
          !authUser && (
            <button
              className="max-w-full btn outline outline-1 outline-slate-600 mt-1"
              onClick={() => {
                navigate("/login");
              }}
            >
              Please Log in first
            </button>
          )}
      </div>
    </div>
  );
};

export default InputPage;
