import React from 'react'

const ClockingStatus = ({type,status}) => {
  return (
      <>
        <br></br>
        <div className='clocking-status bg-light'>
            <div>Type : <h4>{type}</h4></div>
            <div>Status : <h4>{status}</h4></div>
        </div>
      </>

  )
}

export default ClockingStatus