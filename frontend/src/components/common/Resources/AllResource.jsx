import React from "react";
import AllArtsDept from "./Arts/AllArtsDept";
import AllScienceDept from "./Science/AllScienceDept";
import AllCommerceDept from "./Commerce/AllCommerceDept";

const AllResource = () => {
  return (
    <div>
      <h1 className="text-white text-center">Resources</h1>
      <div className="flex flex-col justify-center items-center">
        <AllArtsDept />
        <AllCommerceDept />
        <AllScienceDept />
      </div>
    </div>
  );
};

export default AllResource;
