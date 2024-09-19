import React from 'react'
import AllArtsDept from './Arts/AllArtsDept';
import AllScienceDept from './Science/AllScienceDept';
import AllCommerceDept from './Commerce/AllCommerceDept';

const AllResource = () => {
  return (
    <div>
        <h1 className='text-white'>Resources</h1>
        <AllArtsDept />
        <AllCommerceDept />
        <AllScienceDept />
    </div>
  )
}

export default AllResource;