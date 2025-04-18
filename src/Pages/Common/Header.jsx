import React, { useContext, useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { MdModeEditOutline } from "react-icons/md";
import { FaBars } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import { AppContext } from "../../Context/AppContextProvider";
import ProfileModal from "../popup/ProfileModal";

export const Header = ({
  onProfileImgClick,
  updatedProfileImg,
  profileImgUploadPending,
  setIsModalOpen,
}) => {
  const [openNavbar, setOpenNavbar] = useState(true);
  const [profileImgError, setProfileImgError] = useState(false); // Tracks image load errors

  const [isModalVisible, setIsModalVisible] = useState(false);

  function handleOpenModal() {
    setIsModalVisible(true);
  }
  const handleCloseModal = () => setIsModalVisible(false);

  const navigate = useNavigate();
  const { state } = useContext(AppContext);

  // Automatically close navbar after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpenNavbar(false);
    }, 2000); // Adjusted timing for consistency

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    //re - render page
  }, [state?.authUser]);

  return (
    <>
      <div className="text-2xl w-full flex justify-center items-center h-24 font-bold italic md:gap-28 gap-10">
        <div className="header hover:animate-pulse active:animate-pulse">
          <Link to="/" className="ring ring-purple-600 py-2 px-4 lg:py-6">
            TryYourজ্ঞান
          </Link>
        </div>

        {/* Profile Section */}
        <div className="relative  flex flex-col items-center justify-center ">
          <div
            className="relative ring ring-violet-600 rounded-full w-18 h-18 bg-inherit hover:scale-110 active:scale-110 overflow-hidden"
            onClick={handleOpenModal}
          >
            <img
              key={
                profileImgError
                  ? "error"
                  : updatedProfileImg || state?.authUser?.data.profileImg
              }
              src={
                !profileImgUploadPending && updatedProfileImg
                  ? updatedProfileImg
                  : state?.authUser
                  ? profileImgError || !state?.authUser?.data.profileImg
                    ? "https://res.cloudinary.com/dvsutdpx2/image/upload/v1732181213/ryi6ouf4e0mwcgz1tcxx.png"
                    : state?.authUser?.data.profileImg
                  : "https://res.cloudinary.com/dvsutdpx2/image/upload/v1732181213/ryi6ouf4e0mwcgz1tcxx.png"
              }
              className="rounded-full object-cover"
              alt=""
              onError={(e) => {
                console.error("setProfileImgError : ", e);
                setProfileImgError(true);
              }} // Set error state
            />
          </div>

          {state?.authUser && (
            <div
              className="absolute bottom-0 right-0 bg-violet-600 rounded-full p-1 active:opacity-60 hover:opacity-60 cursor-pointer z-30"
              onClick={(e) => {
                e.stopPropagation();
                onProfileImgClick();
              }}
            >
              <MdModeEditOutline size={15} />
            </div>
          )}

          <div className="absolute -bottom-6 text-sm font-medium text-center">
            {state?.username || "Guest"}
          </div>
        </div>

        {/* Navbar Toggle */}
        <div
          className="px-2"
          onClick={() => {
            setOpenNavbar(!openNavbar);
          }}
        >
          {!openNavbar ? (
            <FaBars
              size={35}
              className="animate-pulse hover:scale-110 active:scale-110"
            />
          ) : (
            <RxCross1
              size={35}
              className="animate-pulse hover:scale-110 active:scale-110"
            />
          )}
        </div>
      </div>

      {state?.authUser && (
        <ProfileModal
          imageUrl={
            !profileImgUploadPending && updatedProfileImg
              ? updatedProfileImg
              : state?.authUser
              ? profileImgError || !state?.authUser?.data.profileImg
                ? "https://res.cloudinary.com/dvsutdpx2/image/upload/v1732181213/ryi6ouf4e0mwcgz1tcxx.png"
                : state?.authUser?.data.profileImg
              : "https://res.cloudinary.com/dvsutdpx2/image/upload/v1732181213/ryi6ouf4e0mwcgz1tcxx.png"
          }
          isVisible={isModalVisible}
          bio={state?.bio}
          onClose={handleCloseModal}
          onProfileImgClick={onProfileImgClick}
        />
      )}

      {/* Navbar Component */}
      <Navbar
        isOpen={openNavbar}
        setIsOpen={setOpenNavbar}
        setIsModalOpen={setIsModalOpen}
        handleOpenModal={handleOpenModal}
      />
    </>
  );
};
