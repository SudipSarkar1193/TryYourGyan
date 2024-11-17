import React, { useState } from "react";

const Question = ({
  question,
  questionNum,
  setQuestionNum,
  upperLimit,
  lowerLimit,
  selectedIndex,
  setSelectedIndex,
  calculateScore,
}) => {
  const [isOneSelected, setIsOneSelected] = useState(false);

  const handleSelect = (index) => {
    return selectedIndex[questionNum] === index
      ? "text-black transition ease-in-out delay-150 bg-blue-600 italic hover:-translate-y-1 hover:scale-110 duration-300 active:-translate-y-1 active:scale-110 duration-300"
      : "option-btn";
  };

  const handleOptionClick = (index) => {
    setSelectedIndex((prev) => {
      const updatedIndex = [...prev];
      updatedIndex[questionNum] = index;
      return updatedIndex;
    });
  };

  return (
    <div className="h-screen w-screen flex items-center flex-col overflow-x-hidden">
      <div className="w-full text-2xl mt-3 flex justify-center mb-4">
        <span className="font-bold italic underline underline-offset-4">
          Question :{" "}
        </span>
        <span className="ml-2 text-blue-600 font-bold border-2 px-3 rounded-full bg-gray-800">
          {question.serial_number}
        </span>
      </div>
      <div className="w-full px-2 lg:text-2xl text-xl flex justify-center items-center text-center lg:mb-8 mb-2 ">
        <span className="text-pretty italic">{question.question}</span>
      </div>

      <div className="my-5 w-[85%]  flex justify-center items-center flex-col gap-4">
        {question.options &&
          question.options.map((option, index) => (
            <button
              className={`${
                !isOneSelected && "option-btn"
              } text-lg w-full min-h-14 outline outline-3 outline-zinc-700 rounded-lg text-white ${
                isOneSelected && handleSelect(index)
              }`}
              onClick={() => {
                handleOptionClick(index);
                setIsOneSelected(!isOneSelected);
              }}
              key={index}
            >
              {option}
            </button>
          ))}
      </div>
      <div className="w-[85%] flex justify-between ">
        <button
          className="bg-blue-950 text-lg w-1/3 max-h-16 h-14 outline outline-3 outline-zinc-400 rounded-lg transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
          onClick={() => {
            if (questionNum > lowerLimit) {
              setQuestionNum((prev) => prev - 1);
            }
          }}
        >
          Previous
        </button>
        {questionNum + 1 != upperLimit && (
          <button
            className="bg-green-900 text-lg w-1/3 max-h-16 h-14 outline outline-3 outline-zinc-400 rounded-lg transition ease-in-out delay-150 active:-translate-y-1 active:scale-110 duration-300"
            onClick={() => {
              if (questionNum + 1 < upperLimit) {
                setQuestionNum((prev) => prev + 1);
              }
            }}
          >
            Next
          </button>
        )}

        {questionNum + 1 == upperLimit && (
          <button
            className="bg-green-900 text-lg w-1/3 max-h-16 h-14 outline outline-3 outline-zinc-400 rounded-lg transition ease-in-out delay-150 active:-translate-y-1 active:scale-110 duration-300"
            onClick={calculateScore}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export { Question };
