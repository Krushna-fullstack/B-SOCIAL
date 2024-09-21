import React from "react";
import ResourceCard from "./../../ResourceCard";

const MusicYears = () => {
  return (
    <div>
      <div className="w-96 flex justify-center items-center bg-gradient-to-b p-4 mx-auto">
        <div className="w-full lg:w-3/4">
          <ResourceCard year="1st Year" link="https://www.amazon.com/" />
        </div>
      </div>
      <div className="w-96 flex justify-center items-center bg-gradient-to-b p-4 mx-auto">
        <div className="w-full lg:w-3/4">
          <ResourceCard year="2nd Year" link="https://www.youtube.com/" />
        </div>
      </div>
      <div className="w-96 flex justify-center items-center bg-gradient-to-b p-4 mx-auto">
        <div className="w-full lg:w-3/4">
          <ResourceCard year="3rd Year" link="https://www.youtube.com/" />
        </div>
      </div>
    </div>
  );
};

export default MusicYears;
