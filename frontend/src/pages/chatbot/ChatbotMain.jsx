import React from "react";
import FuzzyText from "../../ui-components/FuzzyText";
import { FaArrowLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";

const ChatbotMain = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <FuzzyText fontSize="clamp(2rem, 10vw, 10rem)">Elite is</FuzzyText>
      <FuzzyText fontSize="clamp(2rem, 8vw, 10rem)">
        Under development{" "}
      </FuzzyText>
      <button
       
        className="px-6 py-2 rounded-full border text-white hover:bg-blue-700 transition-colors"
      >
        <Link to="/" className="flex gap-2 justify-center items-center ">
        <FaArrowLeft />
        Back
        </Link>
        
      </button>
    </div>
  );
};

export default ChatbotMain;
