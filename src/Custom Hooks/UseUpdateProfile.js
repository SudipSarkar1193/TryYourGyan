import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { backendServer } from "../backendServer";
import { useNavigate } from "react-router-dom";

const useUpdateProfile = (setIsModalOpen) => {
  const navigate = useNavigate();

  const {
    mutate: updateProfile,
    isError: isUpdateProfileError,
    isPending,
  } = useMutation({
    mutationFn: async (updatedData) => {
      const accessToken = localStorage.getItem("accessToken");

      const res = await fetch(`${backendServer}/api/users/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      return await res.json();
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message, {
        style: {
          backgroundColor: "white",
          color: "black",
        },
      });
    },
    onSuccess: (jsonRes, variables) => {
      if (variables?.isEmailChanged) {
        toast.success("An OTP has been sent to the email", {
          style: {
            backgroundColor: "white",
            color: "black",
          },
        });
        setIsModalOpen(false)
        navigate("/verify-email", {
          state: {
            newEmail: variables.email,
          },
        });
      } else {
        toast.success(jsonRes.message, {
          style: {
            backgroundColor: "white",
            color: "black",
          },
        });
      }
    },
  });

  return {
    updateProfile,
    isUpdateProfileError,
    isPending,
  };
};

export default useUpdateProfile;
