import React, { useState } from "react";
import Score from "./Score";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaShareSquare } from "react-icons/fa";
import { toast } from "react-toastify";
import PopupLoader from "../popup/PopupLoader";
import { useMutation } from "@tanstack/react-query";
import { backendServer } from "../../backendServer";
import ConfirmPopup from "../popup/ConfirmPopup";

const formatDateAndTime = (dateString) => {
  const date = new Date(dateString);

  const optionsDate = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", optionsDate); // Example: November 11, 2024

  const optionsTime = { hour: "numeric", minute: "numeric", hour12: true }; // 12-hour format
  const formattedTime = date.toLocaleTimeString("en-US", optionsTime); // Example: 1:00 PM

  return { formattedDate, formattedTime };
};

const QuizBanner = ({
  title,
  score,
  totalQuestions,
  level,
  id,
  date,
  getQuizData,
}) => {
  const handleShare = async (quizId) => {
    try {
      const shareableLink = `https://try-your-gyan.vercel.app/questions-history/${quizId}`;

      const shareableText = `Check out this quiz I just tried ! ${shareableLink}`;

      if (navigator.share) {
        await navigator.share({
          title: shareableText,
          text: shareableText, // Combine text and link
        });
      } else {
        await navigator.clipboard.writeText(shareableText);
        toast.success(`Link copied to clipboard: ${shareableText}`, {
          style: { backgroundColor: "white", color: "black" },
        });
      }
    } catch (error) {
      if (
        error.name === "AbortError" ||
        error.message.includes("The user aborted a request")
      ) {
        console.warn("Share action was canceled by the user.");
      } else {
        console.error("Error sharing the quiz:", error);
        toast.error("Failed to share the quiz. Please try again.", {
          style: { backgroundColor: "white", color: "black" },
        });
      }
    }
  };

  const maxChars = 20;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const { mutate: deleteQuiz } = useMutation({
    mutationFn: async () => {
      setLoading(true);
      const response = await fetch(
        `${backendServer}/api/quiz/quizzes?quizID=${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setLoading(false);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to delete");
      }

      return true;
    },
    onSuccess: () => {
      toast.success(`Quiz '${title}' deleted`, {
        style: { backgroundColor: "white", color: "black" },
      });
      getQuizData();
    },
    onError: (error) => {
      toast.error(error.message, {
        style: { backgroundColor: "white", color: "black" },
      });
    },
  });

  const { formattedDate, formattedTime } = formatDateAndTime(date);

  const InfoComponent = ({ show = false }) => (
    <div
      className={`flex items-center ${
        show ? "justify-around" : ""
      } gap-3 sm:gap-4`}
    >
      <Score score={score} total={totalQuestions} />
      <div className="ring ring-purple-600 rounded-full px-3 py-1 sm:px-4 sm:py-2 shadow-[5px_5px_5px_black] text-sm sm:text-base md:text-lg lg:text-xl font-bold">
        {percentageScore}%
      </div>
      <div className="bg-blue-600/80 px-3 py-1 sm:px-4 sm:py-2 rounded-lg shadow-[5px_5px_5px_black] text-sm sm:text-base md:text-lg lg:text-xl font-bold capitalize">
        {level}
      </div>
    </div>
  );

  const truncateTitle = (text, maxChars) => {
    return text.length > maxChars ? text.slice(0, maxChars) + "..." : text;
  };

  const percentageScore = ((score / totalQuestions) * 100).toFixed(1);

  const openModal = (event) => {
    event.stopPropagation(); // Prevent the click event from propagating to the parent
    document.getElementById(`modal_${id}`).showModal();
  };

  const handleNavigate = () => {
    navigate(`/questions-history/${id}`, {
      state: {
        score,
        totalQuestions,
      },
    });
  };

  const handleModalClose = (event) => {
    event.stopPropagation(); // Prevent the event from triggering navigation on modal close
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 bg-opacity-50 backdrop-blur-sm">
          <PopupLoader
            text={"Deleting the quiz..."}
            loaderText={"Please wait..."}
          />
        </div>
      )}

      <div
        //className="fixed inset-0 z-30 flex items-center justify-center bg-opacity-50 backdrop-blur-sm"
        className={`fixed inset-0 z-40 flex items-center justify-center transition-all duration-1000 backdrop-blur-sm ${
          show
            ? "opacity-100 pointer-events-auto scale-100"
            : "opacity-0 pointer-events-none scale-90"
        }`}
        onClick={() => setShow(false)}
      >
        <ConfirmPopup
          text={`Do you want to delete the quiz : '${truncateTitle(
            title,
            maxChars
          )} '`}
          setShow={setShow}
          handleConfirm={deleteQuiz}
          yesColor="red"
          noColor="blue"
        />
      </div>

      <div
        className="bg-gradient-to-r from-indigo-800 to-purple-800 shadow-lg rounded-lg lg:p-7 md:p-6 border border-white backdrop-blur-sm max-w-3xl mx-auto my-5 sm:my-4 md:my-5 w-11/12 lg:w-full"
        onClick={handleNavigate}
      >
        <div className="flex flex-col sm:flex-row justify-between items-center text-white text-3xl gap-3 sm:gap-4 md:px-4 py-2 ">
          <div
            className="absolute right-2 top-2 text-red-200 hover:scale-90 active:scale-125"
            onClick={(event) => {
              event.stopPropagation();
              setShow(true);
            }}
          >
            <MdDelete size={28} />
          </div>

          <div
            className="absolute right-2 bottom-2 text-red-200 hover:scale-90 active:scale-125"
            onClick={(e) => {
              e.stopPropagation();
              handleShare(id);
            }}
          >
            <FaShareSquare size={23} />
          </div>

          <h1
            onClick={openModal} // Open modal when clicked
            className="text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-wide cursor-pointer"
            title="Click to view full title"
          >
            {truncateTitle(title, maxChars)}
          </h1>

          <div className="flex w-full justify-around items-center ">
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-medium tracking-wide text-gray-400">
              {formattedDate}
            </h1>
            <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-medium tracking-wide text-gray-300">
              {formattedTime}
            </h2>
          </div>

          <InfoComponent />
        </div>

        <dialog id={`modal_${id}`} className="modal">
          <div className="modal-box bg-purple-900">
            <div
              className="absolute right-4 top-4 text-red-200 hover:scale-90 active:scale-125"
              onClick={(event) => {
                event.stopPropagation();
                handleShare(id);
              }}
            >
              <FaShareSquare size={28} />
            </div>

            <h3 className="font-bold text-lg">Topic</h3>
            <p className="py-4">{title}</p>
            <InfoComponent show={true} />
            <div className="modal-action">
              <form method="dialog" onClick={handleModalClose}>
                {" "}
                {/* Prevent event propagation */}
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </>
  );
};

export default QuizBanner;
