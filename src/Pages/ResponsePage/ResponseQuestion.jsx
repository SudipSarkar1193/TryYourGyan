import React from "react";

const ResponseQuestion = ({ question }) => {
  const handleStyling = (index) => {
    if (index == Number(question.correctAnsIndex)) {
      return "bg-green-500";
    } else if (index == Number(question.userInputIndex)) {
      return "bg-red-400";
    }
  };
  return (
    <div className=" flex items-center flex-col overflow-x-hidden m-4 border-2 border-gray-600">
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
              className={`bg-gray-900 text-lg w-full min-h-14 outline outline-3 outline-zinc-400 rounded-lg text-white ${handleStyling(
                index
              )}`}
              key={index}
            >
              {option}
            </button>
          ))}
          <div className="w-full p-2 text-md border-1 border-cyan-500  m-2 text-center">{question.description}</div>
      </div>
    </div>
  );
};

export { ResponseQuestion };
