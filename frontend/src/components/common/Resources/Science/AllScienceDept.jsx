import React from "react";
import PhysicsHons from "./Physics/PhysicsHons";
import ChemistryHons from "./Chemistry/ChemistryHons";
import MathematicsHons from "./Mathematics/MathematicsHons";
import ZoologyHons from "./Zoology/ZoologyHons";
import BotanyHons from "./Botany/BotanyHons";
import Statistics from "./Statistics/Statistics";
import ScienceSyllabus from "./ScienceSyllabus/ScienceSyllabus";

const AllScienceDept = () => {
  return (
    <div>
      <ScienceSyllabus  />
      <PhysicsHons />
      <ChemistryHons />
      <MathematicsHons />
      <ZoologyHons />
      <BotanyHons />
      <Statistics />
    </div>
  );
};

export default AllScienceDept;
