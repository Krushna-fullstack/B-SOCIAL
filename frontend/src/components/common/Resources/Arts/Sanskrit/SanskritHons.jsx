import React from 'react'
import ResourceCard from '../../ResourceCard'

const SanskritHons = () => {
  return (
    <div>
    <div className="md:w-max w-96 flex justify-center items-center bg-gradient-to-b p-4">
      <div className="w-full lg:w-3/4">
        <ResourceCard
          department="Sanskrit Honours"
          stream="Arts"
          link="/sanskrityears"
        />
      </div>
    </div>
  </div>
  )
}

export default SanskritHons