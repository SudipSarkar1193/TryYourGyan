import React from "react";
import { RxCross1 } from "react-icons/rx";
import { MdModeEditOutline } from "react-icons/md";

const ProfileModal = ({ isVisible, onClose, imageUrl, bio ,onProfileImgClick}) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-40 transition-all duration-700 ease-in-out 
        ${
          isVisible
            ? "opacity-100 backdrop-blur-sm"
            : "opacity-0 pointer-events-none"
        }
        bg-black bg-opacity-50`}
    >
      <div
        className={`relative bg-gray-700 w-80 h-auto p-6 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out
        ${isVisible} ? "scale-100" : "scale-95"`}
      >
        {/* Close Button */}
        <button
          className="absolute top-1 right-1 text-white hover:text-gray-400 z-30"
          onClick={onClose}
        >
          <RxCross1 size={28} />
        </button>
        {/* Image Section */}
        <div className="relative w-full mt-4 h-auto bg-gray-200 rounded-lg overflow-clip shadow-xl">
          <img
            src={imageUrl}
            alt="Profile"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute bottom-1 right-1 bg-violet-600 rounded-full p-1 active:opacity-60 hover:opacity-60 cursor-pointer z-50"
            onClick={(e) => {
              e.stopPropagation();
              onProfileImgClick();
            }}
          >
            <MdModeEditOutline size={25} />
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-4">
          <h2 className="text-lg text-btnTextColor font-semibold">Bio</h2>
          <p className="text-white mt-2 whitespace-pre-wrap">{bio}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
