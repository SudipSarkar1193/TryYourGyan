import React from "react";
import { FaHistory } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import { IoSettings } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const Navbar = ({ isOpen, setIsOpen }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logout = async () => {
    // Clear tokens from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");

    //  invalidate queries related to authentication
    await queryClient.invalidateQueries(["authUser"]);

    toast.success("Logged out successfully", {
      style: {
        backgroundColor: "white", // Customize the background color
        color: "black", // Customize the text color
      },
    });

    navigate("/");
  };

  return (
    <div
      className={`fixed  right-0 lg:w-72 w-56 bg-black h-[60%] p-5 shadow-purple-400/50 shadow-xl rounded-md z-50
        ${isOpen ? "animate-slideIn" : "animate-slideOut"}`}
    >
      <ul className="w-full h-full flex flex-col items-start lg:items-center justify-center gap-5 ">
        {/* History */}
        <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
          <button
            className="p-16-semibold flex size-full gap-4 p-4 group font-semibold rounded-full bg-cover transition-all ease-linear text-white hover:bg-gradient-to-r hover:from-purple-400 hover:to-purple-600 hover:text-black focus:bg-gradient-to-r focus:from-purple-400 focus:to-purple-600 focus:text-black"
            onClick={() => {
              setIsOpen(false);
              navigate("/quiz-history");
            }}
          >
            <FaHistory size={25} />
            History
          </button>
        </li>

        {/* Settings */}
        <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
          <button
            className="p-16-semibold flex size-full gap-4 p-4 group font-semibold rounded-full bg-cover transition-all ease-linear text-white hover:bg-gradient-to-r hover:from-purple-400 hover:to-purple-600 hover:text-black focus:bg-gradient-to-r focus:from-purple-400 focus:to-purple-600 focus:text-black"
            onClick={() => {
              setIsOpen(false);
              toast.success("Coming soon...😅",{
                style: {
                  backgroundColor: "white", // Customize the background color
                  color: "black", // Customize the text color
                },
              });
            }}
          >
            <IoSettings size={25} />
            Settings
          </button>
        </li>

        {/* Logout */}
        <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
          <button
            className="p-16-semibold flex size-full gap-4 p-4 group font-semibold rounded-full bg-cover transition-all ease-linear text-white hover:bg-gradient-to-r hover:from-purple-400 hover:to-purple-600 hover:text-black focus:bg-gradient-to-r focus:from-purple-400 focus:to-purple-600 focus:text-black"
            onClick={async () => {
              setIsOpen(false);
              await logout();
            }}
          >
            <TbLogout size={27} />
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export { Navbar };