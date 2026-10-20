import React from 'react'
import { DNA } from 'react-loader-spinner'

const Loader = () => {
  return (
    <div className='w-full h-full flex items-center justify-center'> 
    <DNA
  visible={true}
  height="100"
  width="100"
  ariaLabel="dna-loading"
  wrapperStyle={{}}
  wrapperClass="dna-wrapper"
  color="#1769d1"
  />

  </div>
  )
}

export default Loader