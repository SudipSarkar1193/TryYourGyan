import React from "react";

const ResponseQuestion = ({ question }) => {
  // Helper function to handle styling for both structures
  const handleStyling = (option, userAnswer, correctAnswer, index) => {
    if (question.hasOwnProperty("correctAnsIndex")) {
      // Old structure (with indexes)
      if (index === Number(question.correctAnsIndex)) {
        return "bg-green-500"; // Correct answer
      } else if (index === Number(question.userInputIndex)) {
        return "bg-red-400"; // Incorrect answer
      }
    } else {
      // New structure (with strings)
      if (option === correctAnswer) {
        return "bg-green-500"; // Correct answer
      } else if (option === userAnswer) {
        return "bg-red-400"; // Incorrect answer
      }
    }
    return "bg-gray-900"; // Default style
  };

  // Determine if the user has not answered the question
  const isUnanswered =
    question.hasOwnProperty("userInputIndex")
      ? question.userInputIndex === null || question.userInputIndex === undefined
      : !question.user_answer;

  return (
    <div className="flex items-center flex-col overflow-x-hidden m-4 border-2 border-gray-600 rounded-lg shadow-lg">
      {/* Question number and serial */}
      <div className="w-full text-2xl mt-3 flex justify-center mb-4">
        <span className="font-bold italic underline underline-offset-4">
          Question :
        </span>
        <span className="ml-2 text-blue-600 font-bold border-2 px-3 rounded-full bg-gray-800">
          {question.serial_number}
        </span>
      </div>

      {/* Display the question */}
      <div className="w-full px-2 lg:text-2xl text-xl flex justify-center items-center text-center lg:mb-8 mb-2">
        <span className="text-pretty italic">{question.question}</span>
      </div>

      {/* Display options */}
      <div className="my-5 w-[85%] flex justify-center items-center flex-col gap-4">
        {question.options &&
          question.options.map((option, index) => (
            <button
              key={index}
              className={`text-lg w-full min-h-14 outline outline-3 outline-zinc-400 rounded-lg text-white ${handleStyling(
                option,
                question.user_answer,
                question.correctAnswer,
                index
              )}`}
            >
              {option}
            </button>
          ))}

        {/* Message if the user hasn't answered */}
        {isUnanswered && (
          <div className="w-full p-3 text-center text-yellow-500 bg-gray-800 border border-yellow-400 rounded-lg">
            <strong>Note:</strong> No answer was provided for this question.
          </div>
        )}

        {/* Additional description (if any) */}
        {question.description && (
          <div className="w-full p-2 text-md border-1 border-cyan-500 m-2 text-center">
            {question.description}
          </div>
        )}
      </div>
    </div>
  );
};

export { ResponseQuestion };
