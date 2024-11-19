import React from "react";
import { LoaderWithText } from "../Common/LoaderWithText";

const Card = () => {
  return (
    <div className="bg-gray-900 w-80  rounded-xl shadow-md p-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <span className="block text-lg font-bold text-gray-200 mb-4 text-center">
        Quiz is being submitted
      </span>
      <p className="text-gray-200 text-md text-center mb-6">
        <LoaderWithText text={"Please wait ..."} textSize={"3xl"} />
      </p>
    </div>
  );
};

const PopupLoader = () => {
  return <Card />;
};

export default PopupLoader;
