import React, { useEffect } from "react";

const ConfirmPopup = ({
  text,
  setShow,
  handleConfirm,
  yesColor = "lime",
  noColor = "orange",
  yesText = "Yes",
  noText = "Cancel",
  setProfileImg,
}) => {
  const colors = {
    lime: "from-lime-600",
    orange: "from-orange-500",
    red: "from-red-700",
    blue: "from-blue-500",
    green: "from-green-500",
  };

  const yesClr = colors[yesColor] || "from-gray-500";
  const noClr = colors[noColor] || "from-gray-500";

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setShow(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setShow]);

  return (
    <>
      {/* Popup */}
      <div className="bg-gray-900/85 w-80 rounded-xl shadow-xl p-6 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 border border-gray-700">
        <h3 className="text-center text-xl text-white font-semibold italic mb-4">
          {text}
        </h3>
        <div className="flex justify-center gap-4">
          <button
            className={`bg-gradient-to-r ${yesClr} to-[#21023b] w-1/2 py-2 text-white font-medium rounded-full text-sm tracking-wide shadow-md hover:scale-105 transition-all duration-300`}
            onClick={handleConfirm}
          >
            {yesText}
          </button>
          <button
            className={`bg-gradient-to-r ${noClr} to-[#21023b] w-1/2 py-2 text-white font-medium rounded-full text-sm tracking-wide shadow-md hover:scale-105 transition-all duration-300`}
            onClick={() => {
              setShow(false);
              if (setProfileImg) setProfileImg(null);
            }}
          >
            {noText}
          </button>
        </div>
      </div>
    </>
  );
};

export default ConfirmPopup;
