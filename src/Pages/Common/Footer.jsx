import React from "react";

const Footer = () => {
  return (
    <div className="lg:flex hidden text-gray-400 bg-black text-lg  w-full h-10  justify-center items-center border-t-2 border-gray-400 fixed bottom-0">
      Made with ❤️ by
      <span className="ml-2 cursor-pointer hover:opacity-60 text-slate-300">
        <a href="https://www.instagram.com/lyadhkhor.ss/?next=%2F">
          Sudip Sarkar
        </a>
      </span>
    </div>
  );
};

export default Footer;
