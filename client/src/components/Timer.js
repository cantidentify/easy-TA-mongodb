import React, { useState } from 'react'

const Timer = () => {
    const [time, setTime] = useState(new Date().toLocaleString())
    function timer(){
        setInterval(() => {
            setTime(new Date().toLocaleString())
        }, 1000);
    }

    timer()
  return (
    <>{time}</>
  )
}

export default Timer