import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { ImCross } from "react-icons/im";
import { Header } from "./Pages/Common/Header";
import Footer from "./Pages/Common/Footer";
import Banner from "./Pages/Common/Banner";
import AuthPage from "./Pages/Auth/AuthPage";
import InputPage from "./Pages/InputPage/InputPage";
import { useContext, useEffect, useRef, useState } from "react";
import QuizPage from "./Pages/QuizPage/QuizPage";
import { Question } from "./Pages/QuizPage/Question";
import Response from "./Pages/ResponsePage/Response";
import ErrorPage from "./Pages/ErrorPage/ErrorPage";
import { toast, ToastContainer } from "react-toastify";
import QuizHistory from "./Pages/HistoryPage/QuizHistory";
import Questions from "./Pages/HistoryPage/Questions";

import OtpInput from "./Pages/Auth/OTPVerificationForm";
import ConfirmPopup from "./Pages/popup/ConfirmPopup";
import { useMutation } from "@tanstack/react-query";
import { backendServer } from "./backendServer";
import PopupLoader from "./Pages/popup/PopupLoader";
import ProfileImgUploadHook from "./Custom Hooks/ProfileImgUploadHook";
import { AppContext } from "./Context/AppContextProvider";
import useUpdateProfile from "./Custom Hooks/UseUpdateProfile";
import EmailVerifyPage from "./Pages/EmailVerifyPage/EmailVerifyPage";

export function App() {
  const location = useLocation();

  const profileImgRef = useRef(null);
  const [profileImg, setProfileImg] = useState(null);
  const [profileImgUploadPending, setProfileImgUploadPending] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [show, setShow] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    currentPassword: "",
    newPassword: "",
  });

  const { state, setState } = useContext(AppContext);

  const {
    HandleProfileImgUpload,
    isHandleProfileImgUploadError,
    loading: profileImgUploadLoading,
  } = ProfileImgUploadHook({ profileImg, setProfileImg });

  const handleImgChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024);
      const maxSizeInMB = 6;
      if (fileSizeInMB <= maxSizeInMB) {
        const reader = new FileReader();
        setProfileImgUploadPending(true);
        reader.onload = () => {
          setProfileImg(reader.result);
          setProfileImgUploadPending(false);

          setTimeout(() => {
            setShow(true);
          }, 800);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const {
    updateProfile,
    isUpdateProfileError,
    isPending: isUpdatingProfile,
  } = useUpdateProfile(setIsModalOpen);

  const handleUpdateProfile = async () => {
    // e.preventDefault();

    const reqData = {
      ...formData,
      isUsernameChanged:
        formData.username.trim() != state?.authUser?.data.username,
      isEmailChanged: formData.email.trim() != state?.authUser?.data.email,
      isbioChanged: formData.username.trim() != state?.authUser?.data.bio,
      isPasswordChanged: formData.newPassword.trim() != "",
    };

    console.log("reqData", reqData);

    if (reqData.isPasswordChanged && !formData.currentPassword) {
      toast.error("Please enter the current password");
      return;
    }

    updateProfile(reqData)
    // Add API call or logic to update profile
  };

  useEffect(() => {
    // Set the theme on initial load
    document.documentElement.setAttribute("data-theme", "dark");
    console.log("STATE (initial load): ", state);
  }, []);

  useEffect(() => {
    if (state?.authUser?.data) {
      setFormData((prev) => ({
        ...prev,
        username: state.authUser.data.username || "",
        email: state.authUser.data.email || "",
        bio: state.authUser.data.bio || "",
      }));
    }
    console.log("state.authUser.data : ", state?.authUser?.data);
  }, [state?.authUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfileImg = (e) => {
    e.preventDefault();
    //mutateFn:
    HandleProfileImgUpload();
    setShow(false);
  };

  return (
    <div className="app h-svh w-svw ">
      {/* Conditionally render the Header based on the route */}
      <ToastContainer
        limit={1}
        position={"top-center"}
        autoClose={2700}
        draggable
        draggableDirection={"x"}
      />

      {location.pathname !== "/quiz" && (
        <Header
          profileImgRef={profileImgRef}
          updatedProfileImg={profileImg}
          profileImgUploadPending={profileImgUploadPending}
          setIsModalOpen={setIsModalOpen}
        />
      )}

      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <ConfirmPopup
            text={"Do you want to update your profile picture ?"}
            setShow={setShow}
            handleConfirm={handleUpdateProfileImg}
            setProfileImg={setProfileImg}
          />
        </div>
      )}
      {profileImgUploadLoading && (
        <div className="fixed inset-0 z-50 bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
          <PopupLoader text={"Image is being uploaded..."} />
        </div>
      )}

      <>
        {/* Edit profile Modal */}
        {isModalOpen && !show && (
          <div className="fixed inset-0 z-40 flex items-center justify-center">
            <div
              className="fixed inset-0 z-40 bg-opacity-50 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            ></div>

            <div className="modal-box border rounded-md border-gray-700 shadow-md bg-black z-50">
              <h3 className="font-bold text-lg my-3">Update Profile</h3>
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log("EVENT ", e);
                  handleUpdateProfile();
                  
                }}
              >
                {/* Username and Email */}
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    placeholder="Username"
                    className="flex-1 input border border-gray-700 rounded p-2 input-md"
                    value={formData.username}
                    name="username"
                    onChange={handleInputChange}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="flex-1 input border border-gray-700 rounded p-2 input-md"
                    value={formData.email}
                    name="email"
                    onChange={handleInputChange}
                  />
                </div>

                {/* Password Fields */}
                {state?.authUser?.data?.password && (
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="password"
                      placeholder="Current Password"
                      className="flex-1 input border border-gray-700 rounded p-2 input-md"
                      value={formData.currentPassword}
                      name="currentPassword"
                      onChange={handleInputChange}
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      className="flex-1 input border border-gray-700 rounded p-2 input-md"
                      value={formData.newPassword}
                      name="newPassword"
                      onChange={handleInputChange}
                    />
                  </div>
                )}

                {/* Bio Field */}
                <textarea
                  type="text"
                  placeholder="Bio"
                  className="flex-1 input border border-gray-700 rounded p-2 input-md h-auto"
                  value={formData.bio}
                  name="bio"
                  onChange={handleInputChange}
                />

                {/* Profile Picture Upload */}
                <div
                  className="rounded text-center py-2 px-2 text-white bg-gray-600 text-md w-48 md:w-52 lg:w-64 cursor-pointer"
                  onClick={() => profileImgRef.current.click()}
                >
                  {profileImgUploadLoading
                    ? "Uploading..."
                    : "Upload profile picture"}
                </div>
                <input
                  type="file"
                  ref={profileImgRef}
                  className="hidden"
                  onChange={handleImgChange}
                />

                {/* Submit Button */}
                <button
                  className="bg-gradient-to-r from-blue-700 to-[#21023b] w-full p-2 text-white border-none rounded-full text-sm tracking-widest font-medium cursor-pointer my-5 transition-all duration-300"
                  disabled={isUpdatingProfile}
                >
                  {isUpdatingProfile ? "Updating..." : "Update"}
                </button>
              </form>

              {/* Close Button */}
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={() => setIsModalOpen(false)}
              >
                <ImCross size={25} />
              </button>
            </div>
          </div>
        )}
      </>
      <input
        type="file"
        hidden
        ref={profileImgRef}
        accept="image/*"
        onChange={handleImgChange}
      />
      <Routes>
        <Route path="/" element={<InputPage />} />
        <Route path="*" element={<InputPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage isLoginPage={false} />} />
        <Route path="/verify" element={<OtpInput />} />
        <Route path="/verify-email" element={<EmailVerifyPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/response-history" element={<Response />} />
        <Route path="/quiz-history" element={<QuizHistory />} />
        <Route path="/questions-history" element={<Questions />} />
      </Routes>
    </div>
  );
}
