import React from 'react'
import ResourceCard from "./../../ResourceCard";

const PhilosophyHons = () => {
  return (
    <div className="md:w-max w-96 flex justify-center items-center bg-gradient-to-b p-4">
    <div className="w-full lg:w-3/4">
      <ResourceCard
        department="Philosophy Honours"
        stream="Arts"
        link="/philosophyyears"
      />
    </div>
  </div>
  )
}

export default PhilosophyHons