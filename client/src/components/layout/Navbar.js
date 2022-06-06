import React from 'react'
import { Link } from 'react-router-dom'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { logOut } from '../../features/user'

const Navbar = () => {
  const dispatch = useDispatch()
  const userReduce = useSelector((state) => state.user)  

  return (
    <nav className="navbar bg-dark">
    <h1>
      <Link to="/"><i className="fa-solid fa-business-time"></i> Easy TA</Link>
    </h1>
    <ul>
      <li><Link to="/">Clock-In / Out</Link></li>
      <li><Link to="/summary">Summary</Link></li>
      <li><Link to="/Sign-In-Up">Sign-In / Sign-Up</Link></li>
      {userReduce.id ? 
        <li><a onClick={() => dispatch(logOut())} href="/"><i className="fa-solid fa-right-from-bracket"></i>{' '}<span className="hide-sm">Logout</span></a></li> 
        : null}

    </ul>
  </nav>
  )
}

export default Navbar