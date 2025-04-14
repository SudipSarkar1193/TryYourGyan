import React, { useContext, useEffect, useState } from "react";
import Banner from "../Common/Banner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../Common/LoadingSpinner";
import Loader2 from "../Common/Loader2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendServer } from "../../backendServer";
import PopupLoader from "../popup/PopupLoader";
import { getAccessToken } from "../../utils/tokenManagement";
import { AppContext } from "../../Context/AppContextProvider";

const InputPage = () => {
  const [value, setValue] = useState(5);
  const [difficulty, setDifficulty] = useState("Easy");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { state, setState } = useContext(AppContext);

  const { mutate, isLoading, isError, error, isSuccess } = useMutation({
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

        console.log("res : \n",res)

        if (!res.ok) {
          const errorText = await res.text();
          const errorJsonString = errorText.replace("Error: ", "");
          const errorMessage = JSON.parse(errorJsonString);
          
          throw errorMessage;
        }

        const jsonRes = await res.json();
        console.log("jsonRes.data ",jsonRes)
        console.log("jsonRes.data : \n",jsonRes.data)
        console.log("type : \n",typeof jsonRes.data)
        

        const data = jsonRes.data;
        setLoading(false);
        return data;
      } catch (error) {
        setLoading(false);
        throw error;
      }
    },
    onError: () => {
      navigate("/error", { state: { msg: "Error Generating the Quiz" } });
    },
    onSuccess: (data) => {
      if (data) {
        if (data?.ok) {
          navigate("/quiz", {
            state: {
              quizData: data?.data,
              topic,
              level: difficulty,
              totalQuestions: value,
            },
          });
        } else {
          navigate("/error", { state: { msg: data[1] } });
        }
      }
    },
  });

  const {
    data: authUser,
    isLoading: isAuthLoading,
    error: authError,
    isSuccess: isAuthSuccess,
  } = useQuery({
    queryKey: ["userAuth"],
    queryFn: async () => {
      const accessToken = localStorage.getItem("accessToken");
      const res = await fetch(`${backendServer}/api/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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

      return await res.json();
    },

    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!getAccessToken(),
  });

  const handleRangeInputChange = (e) => setValue(Number(e.target.value));
  const handleSelectInputChange = (e) => setDifficulty(e.target.value);
  const handleTopicChange = (e) => setTopic(e.target.value);
  const handleSubmit = (e) => {
    e.preventDefault();
    mutate();
  };

  useEffect(() => {
    setState({
      profileImg: authUser?.data.profileImg,
      authUser,
      bio: authUser?.data.bio,
      username: authUser?.data.username,
    });
  }, [authUser, isAuthSuccess]);

  return (
    <>
      {loading ? (
        <div className="w-full max-h-full flex flex-col items-center justify-start bg-inherit overflow-hidden gap-6">
          <div className="text-2xl font-bold italic text-center mt-28 lg:mt-40">
            {`Quiz is being generated for you,`} <br />
            {` ${localStorage.getItem("username") || ""} 😄`}
          </div>
          <div className="text-2xl font-bold italic text-center">
            <div className="w-full flex justify-center">
              <span>Please Wait</span> <Loader2 />
            </div>
          </div>
          <LoadingSpinner />
          <div className="text-xl font-bold text-yellow-600 italic text-center mt-28 lg:mt-40">
            Developed by : Sudip Sarkar
          </div>
        </div>
      ) : isAuthLoading ? (
        <PopupLoader text={"Authenticating..."} />
      ) : (
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-around w-full h-5/6 gap-4 overflow-hidden app">
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
                  <option value="" disabled>
                    Select Difficulty Level
                  </option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
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
              <div className="w-full flex items-center justify-evenly flex-col">
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
                  max="20"
                  value={value}
                  onChange={handleRangeInputChange}
                />
                <div className="mt-1 text-lg">{value}</div>
              </div>
              <div className="w-full flex justify-center">
                {getAccessToken() &&
                  state?.authUser &&
                  state?.authUser.data.isVarified && (
                    <button
                      type="submit"
                      className="btn outline outline-1 outline-slate-600 mt-1"
                    >
                      Generate Your Quiz
                    </button>
                  )}
              </div>
            </form>
            <div className="w-full flex justify-center">
              {!(
                getAccessToken() &&
                state?.authUser &&
                state?.authUser.data.isVarified
              ) && (
                <button
                  className="btn outline outline-1 outline-slate-600 mt-1"
                  onClick={() => navigate("/login")}
                >
                  Please Log in First
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InputPage;
