import React from "react";
import ResourceCard from "../../ResourceCard";

const MathematicsHons = () => {
  return (
    <div>
      <div>
        <div className="md:w-max w-96 flex justify-center items-center bg-gradient-to-b p-4">
          <div className="w-full lg:w-3/4">
            <ResourceCard
              department="Mathematics Honours"
              stream="Science"
              link="/mathematicsyears"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathematicsHons;
