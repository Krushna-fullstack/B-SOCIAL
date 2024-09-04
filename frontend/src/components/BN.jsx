import React from "react";

const BN = () => {
  return (
    <footer className="fixed bottom-0 inset-x-0 bg-base-200 text-base-content border-t border-base-300">
      <nav className="flex justify-around items-center p-3">
        <a href="#home" className="flex flex-col items-center">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l9-9 9 9-9 9-9-9z"
            ></path>
          </svg>
          <span className="text-sm">Home</span>
        </a>
        <a href="#search" className="flex flex-col items-center">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 4a6 6 0 016 6 6 6 0 01-6 6 6 6 0 01-6-6 6 6 0 016-6zm-1 6a1 1 0 001 1 1 1 0 001-1 1 1 0 00-1-1 1 1 0 00-1 1z"
            ></path>
          </svg>
          <span className="text-sm">Search</span>
        </a>
        <a href="#notifications" className="flex flex-col items-center">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 2a1 1 0 00-1 1v2a1 1 0 001 1 1 1 0 001-1V3a1 1 0 00-1-1zM6 7a1 1 0 00-1 1v8a1 1 0 001 1h12a1 1 0 001-1V8a1 1 0 00-1-1H6zm0 2h12v6H6V9z"
            ></path>
          </svg>
          <span className="text-sm">Notifications</span>
        </a>
        <a href="#profile" className="flex flex-col items-center">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 14a4 4 0 100-8 4 4 0 000 8zm0 2a8 8 0 00-8 8h16a8 8 0 00-8-8z"
            ></path>
          </svg>
          <span className="text-sm">Profile</span>
        </a>
      </nav>
    </footer>
  );
};

export default BN;
