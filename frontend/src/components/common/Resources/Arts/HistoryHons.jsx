import React from 'react'
import ResourceCard from '../ResourceCard'

const HistoryHons = () => {
  return (
    <div className="w-96 flex justify-center items-center bg-gradient-to-b p-4">
    {/* Make the card take up a larger portion of the width */}
    <div className="w-full lg:w-3/4">
      <ResourceCard
        department="History Honours"
        year="1st Year"
        link="https://example.com"
      />
    </div>
  </div>
  )
}

export default HistoryHons