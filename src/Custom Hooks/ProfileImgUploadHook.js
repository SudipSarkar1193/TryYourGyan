import { useMutation } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import React, { useState } from "react";
import { backendServer } from "../backendServer";

const ProfileImgUploadHook = ({ profileImg, setProfileImg }) => {
  const [loading, setLoading] = useState(false);
  const {
    mutate: HandleProfileImgUpload,
    isError: isHandleProfileImgUploadError,
  } = useMutation({
    mutationFn: async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem("accessToken");
        console.log("accessToken from ya know :",accessToken)
        const res = await fetch(
          `${backendServer}/api/users/update-profile-pic`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
              
            },
            body: JSON.stringify({
              profileImgUrl: profileImg,
            }),
            credentials: "include",
          }
        );

        if (!res.ok) {
          const errorText = await res.text();

          throw new Error(errorText);
        }

        const jsonRes = await res.json();
        setLoading(false);
        //setProfileImgUploadLoading(false);
        return jsonRes;
      } catch (error) {
        setLoading(false);
        throw error;
      }
    },
    onError: (error) => {
      console.error(error);
      setProfileImg(null);
      toast.error(error.message, {
        style: {
          backgroundColor: "white", // Customize the background color
          color: "black", // Customize the text color
        },
      });
    },
    onSuccess: (jsonRes) => {
      toast.success(jsonRes.message, {
        style: {
          backgroundColor: "white", // Customize the background color
          color: "black", // Customize the text color
        },
      });
    },
  });

  return { HandleProfileImgUpload, isHandleProfileImgUploadError, loading };
};

export default ProfileImgUploadHook;
