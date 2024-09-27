import React from "react";
import AllArtsDept from "./Arts/AllArtsDept";
import AllScienceDept from "./Science/AllScienceDept";
import AllCommerceDept from "./Commerce/AllCommerceDept";
import AllSfRegular from "./SF-Regular/AllSfRegular";
import AllSFPPP from "./SF_PPP/AllSFPPP.JSX";

const AllResource = () => {
  return (
    <div>
      <h1 className="text-white text-center  my-3  mt-7 font-medium text-4xl">
        Resources
      </h1>
      <h2 className="text-sm mx-3 flex justify-center text-gray-500">
        This section is tailored to the curriculum of BJB Junior College and BJB
        Autonomous College for the current academic year.
      </h2>
      <div className="flex flex-col justify-center items-center">
        <AllScienceDept />
        <AllCommerceDept />
        <AllArtsDept />
        <AllSfRegular />
        <AllSFPPP />
      </div>
    </div>
  );
};

export default AllResource;
