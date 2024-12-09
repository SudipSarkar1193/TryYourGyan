import React from "react";

import PerctLoader from "./PerctLoader";
import { LoaderWithText } from "../Common/LoaderWithText";
import Loader2 from "../Common/Loader2";

const PopupLoader = ({ text, loaderText, extraText }) => {
  return (
    <div className="bg-gray-900 w-80 rounded-xl shadow-md p-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <span className=" text-lg font-semibold  text-gray-200 mb-4 text-center block">
        {text}
      </span>
      <div className={`text-gray-200 text-md text-center mb-6`}>
        {loaderText ? (
          <LoaderWithText text={loaderText} textSize="xl" />
        ) : (
          <>
            <p className="text-btnTextColor font-medium italic" >{extraText}</p>
            <PerctLoader />
          </>
        )}
      </div>
    </div>
  );
};

export default PopupLoader;
