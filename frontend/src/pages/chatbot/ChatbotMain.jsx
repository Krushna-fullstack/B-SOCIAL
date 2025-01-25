import React, { useContext } from "react";
import { Context } from "./Context/Context";
import { SiGooglegemini } from "react-icons/si";
import { FaUser } from "react-icons/fa";
import { RiSendPlane2Fill } from "react-icons/ri";
import ShinyText from "../../ui-components/ShinyText"; // Import ShinyText component

const ChatbotMain = () => {
  const { onSent, input, setInput, loading, showResult, resultData } =
    useContext(Context);

  return (
    <div>
      <div className="main bg-secondary h-screen flex flex-col">
        {/* Logo and Header Section */}
        <div className="flex flex-col items-center justify-center pt-8 pb-4 bg-gray-900">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-16 h-16 rounded-full shadow-lg border-2 border-primary mb-4"
          />
          <ShinyText
            text="Together We Thrive"
            disabled={false}
            speed={3}
            className="text-2xl font-bold text-center text-white"
          />
        </div>

        {/* Navbar */}
        <div className="nav text-white flex items-center justify-between px-4 py-2 shadow">
          <div className="w-8"></div>
          <p className="ai-name text-xl font-bold flex items-center">
            Elite
            <SiGooglegemini className="text-primary" />
          </p>
          <FaUser className="text-2xl" />
        </div>

        {/* Chat Content */}
        <div className="chat-container flex-1 overflow-auto p-4">
          {showResult && (
            <div className="response-container">
              {loading ? (
                <div className="loading-animation">Loading...</div>
              ) : (
                <div className="response-content">{resultData}</div>
              )}
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="px-4 py-4 pb-8 bg-neutral-800 sticky bottom-0 z-10 flex flex-col justify-center items-center">
          <div className="flex items-center bg-black rounded-lg px-4 py-2 w-full max-w-3xl">
            <input
              className="flex-grow bg-transparent border-none focus:outline-none text-white text-lg py-2"
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Enter Your Query here"
            />
            <RiSendPlane2Fill
              className={`text-3xl ml-2 ${
                input ? "text-primary cursor-pointer" : "text-gray-600"
              }`}
              onClick={() => onSent()}
            />
          </div>
          <p className="text-sm text-gray-400 mt-2">Powered by Google</p>
        </div>
      </div>
    </div>
  );
};

export default ChatbotMain;
