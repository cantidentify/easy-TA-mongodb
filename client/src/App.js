import React, {Fragment , useEffect} from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Clocking from './pages/Clocking';
import SignInUp from './pages/SignInUp';
import Summary from './pages/Summary';

import './App.css';

// Redux
import store from './store'
import { Provider } from 'react-redux'
import { setUser } from '../src/features/user'

const App = () => {

  useEffect(() => {
    if(localStorage.userData){
      const userData = localStorage.getItem('userData')
      store.dispatch(setUser(JSON.parse(userData)))
    }
  }, [])

  return(
  <Provider store={store}>
    <Router>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Clocking/>}/>
        <Route path='summary' element={<Summary/>} />
        <Route path='Sign-In-Up' element={<SignInUp/>} />
      </Routes>
    </Router>
  </Provider>
  )

}



export default App;
