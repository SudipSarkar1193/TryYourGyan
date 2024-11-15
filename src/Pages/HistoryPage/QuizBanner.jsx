import React from "react";
import Score from "./Score";
import { useNavigate } from "react-router-dom";

const formatDateAndTime = (dateString) => {
  const date = new Date(dateString);

  const optionsDate = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", optionsDate); // Example: November 11, 2024

  const optionsTime = { hour: "numeric", minute: "numeric", hour12: true }; // 12-hour format
  const formattedTime = date.toLocaleTimeString("en-US", optionsTime); // Example: 1:00 PM

  return { formattedDate, formattedTime };
};

const QuizBanner = ({ title, score, totalQuestions, level, id, date }) => {
  const maxChars = 20;
  const navigate = useNavigate();

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
    navigate("/questions-history", {
      state: {
        id,
        score,
        totalQuestions,
      },
    });
  };

  const handleModalClose = (event) => {
    event.stopPropagation(); // Prevent the event from triggering navigation on modal close
  };

  return (
    <div
      className="bg-gradient-to-r from-indigo-800 to-purple-800 shadow-lg rounded-lg lg:p-3 md:p-6 border border-white backdrop-blur-sm max-w-3xl mx-auto my-5 sm:my-4 md:my-5 w-11/12 lg:w-5/6"
      onClick={handleNavigate} // Navigation triggered on any click except h1
    >
      <div className="flex flex-col sm:flex-row justify-between items-center text-white text-3xl gap-3 sm:gap-4 md:px-4 py-2">
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
  );
};

export default QuizBanner;
