import React from 'react'
import ResourceCard from "../../ResourceCard";

const MbaAbYears = () => {
  return (
    <div>
      <div>
        <h1 className="text-lg font-medium flex justify-center my-4">
          Choose Your Current Academic Year
        </h1>
        <div className="w-96 flex justify-center items-center bg-gradient-to-b p-4 mx-auto">
          <div className="w-full lg:w-3/4">
            <ResourceCard
              year="Syllabus"
              link="https://drive.google.com/file/d/1-TWXvHp-1JqogmWJMXgJtQXL40u1Ohvw/view?usp=sharing" // Same link for demo purposes
            />
          </div>
        </div>
        <div className="w-96 flex justify-center items-center bg-gradient-to-b p-4 mx-auto">
          <div className="w-full lg:w-3/4">
            <ResourceCard
              year="1st Year"
              link="https://drive.google.com/file/d/1-TWXvHp-1JqogmWJMXgJtQXL40u1Ohvw/view?usp=sharing" // Same link for demo purposes
            />
          </div>
        </div>
        <div className="w-96 flex justify-center items-center bg-gradient-to-b p-4 mx-auto">
          <div className="w-full lg:w-3/4">
            <ResourceCard
              year="2nd Year"
              link="https://www.youtube.com/" // Same link for demo purposes
            />
          </div>
        </div>
        <div className="w-96 flex justify-center items-center bg-gradient-to-b p-4 mx-auto">
          <div className="w-full lg:w-3/4">
            <ResourceCard
              year="3rd Year"
              link="https://www.youtube.com/" // Same link for demo purposes
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MbaAbYears