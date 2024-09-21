import React from "react";
import PhysicsHons from "./Physics/PhysicsHons";
import ChemistryHons from "./Chemistry/ChemistryHons";
import MathematicsHons from "./Mathematics/MathematicsHons";
import ZoologyHons from "./Zoology/ZoologyHons";
import BotanyHons from "./Botany/BotanyHons";
import Statistics from "./Statistics/Statistics";

const AllScienceDept = () => {
  return (
    <div>
      <PhysicsHons />
      {/* <ChemistryHons />
        <MathematicsHons />
        <ZoologyHons />
        <BotanyHons />
        <Statistics /> */}
    </div>
  );
};

export default AllScienceDept;
