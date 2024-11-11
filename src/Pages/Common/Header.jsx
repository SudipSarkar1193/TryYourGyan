import React from "react";
import { RiChatHistoryFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  return (
    <div className=" text-3xl lg:text-4xl  w-full  flex justify-center items-center lg:justify-around  lg:h-16 font-bold  italic hover:animate-pulse active:animate-pulse  lg:pt-24 pt-5 lg:gap-10 gap-4">
      <div className="header">
        <Link to={"/"} className="ring ring-purple-600 py-2 px-4 lg:py-6 ">
          TryYourজ্ঞান
        </Link>
      </div>

      <div className=" lg:w-36 lg:h-36  block ring rounded-full w-20 h-20 bg-inherit my-4">
        <img
          src="./undraw_questions_re_1fy7.svg"
          className="w-full aspect-[3/2] object-contain shadow-"
          alt="quiz img"
        />
      </div>

      <div
        className="px-2"
        onClick={() => {
          navigate("/quiz-history");
        }}
      >
        <RiChatHistoryFill />
      </div>
    </div>
  );
};
