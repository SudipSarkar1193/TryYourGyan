import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { FaBars } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";

export const Header = () => {
  const [openNavbar, setOpenNavbar] = useState(true);
  const navigate = useNavigate();

  // Automatically close navbar after 3 seconds to close the navbar
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpenNavbar(false);
    }, 1750);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []); // Empty dependency array ensures this runs only once

  return (
    <>
      <div className="text-3xl lg:text-4xl w-full flex justify-center items-center md:justify-around lg:h-16 font-bold italic hover:animate-pulse active:animate-pulse lg:pt-24 pt-5 lg:gap-10 gap-4">
        <div className="header">
          <Link to={"/"} className="ring ring-purple-600 py-2 px-4 lg:py-6">
            TryYourজ্ঞান
          </Link>
        </div>

        <div
          className="lg:w-36 lg:h-36 block ring rounded-full w-20 h-20 bg-inherit my-4"
          onClick={() => navigate("/")}
        >
          <img
            src="./undraw_questions_re_1fy7.svg"
            className="w-full aspect-[3/2] object-contain"
            alt="quiz img"
          />
        </div>

        <div
          className="px-2"
          onClick={() => {
            setOpenNavbar(!openNavbar);
          }}
        >
          {!openNavbar && <FaBars size={35} className="animate-pulse" />}
          {openNavbar && <RxCross1 size={35} className="animate-pulse" />}
        </div>
      </div>
      <Navbar isOpen={openNavbar} setIsOpen={setOpenNavbar} />
    </>
  );
};
