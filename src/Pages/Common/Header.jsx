import React, { useContext, useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { FaBars } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import { getAccessToken } from "../../utils/tokenManagement"; // Assuming this function handles token management.
import { AppContext } from "../../Context/AppContextProvider";

export const Header = () => {
  const [openNavbar, setOpenNavbar] = useState(true);

  const navigate = useNavigate();

  const { state } = useContext(AppContext);

  
  // Automatically close navbar after 3 seconds to close the navbar
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpenNavbar(false);
    }, 1992);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []); // Empty dependency array ensures this runs only once

  return (
    <>
      <div className="text-2xl w-full flex justify-center items-center h-24 font-bold italic md:gap-28 gap-12">
        <div className="header hover:animate-pulse active:animate-pulse">
          <Link to={"/"} className="ring ring-purple-600 py-2 px-4 lg:py-6">
            TryYourজ্ঞান
          </Link>
        </div>

        <div
          className="block ring rounded-full w-16 h-16 bg-inherit my-4 hover:scale-110 active:scale-110"
          onClick={() => navigate("/")}
        >
          <img
            key={state?.profileImg} // Forces React to remount the image on state change
            src={
              state?.profileImg ||
              "https://res.cloudinary.com/dvsutdpx2/image/upload/v1732181213/ryi6ouf4e0mwcgz1tcxx.png"
            }
            className="rounded-full object-contain"
            alt="profile img"
          />
        </div>

        <div
          className="px-2"
          onClick={() => {
            setOpenNavbar(!openNavbar);
          }}
        >
          {!openNavbar && (
            <FaBars
              size={35}
              className="animate-pulse hover:scale-110 active:scale-110"
            />
          )}
          {openNavbar && (
            <RxCross1
              size={35}
              className="animate-pulse hover:scale-110 active:scale-110"
            />
          )}
        </div>
      </div>
      <Navbar isOpen={openNavbar} setIsOpen={setOpenNavbar} />
    </>
  );
};
