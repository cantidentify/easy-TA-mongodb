import React, { useState } from 'react'
import { Button } from '@material-ui/core';
import FormControl from '@mui/material/FormControl';
import TextField from "@material-ui/core/TextField";
import { Navigate } from "react-router-dom";

// redux
import { useDispatch, useSelector } from 'react-redux'
import { signInIdChange, signInPasswordChange, signInCheckTextInput, signInAsync } from '../features/signIn';
import { signUpIdChange, signUpFullName, signUpPasswordChange, signUpConfirmPasswordChange, signUpCheckTextInput, registerNewUserAsync } from '../features/signUp';
import { setUser } from '../features/user'

const SignInUp = () => {
  const signInReduce = useSelector((state) => state.signIn)  
  const signUpReduce = useSelector((state) => state.signUp)  
  const userReduce = useSelector((state) => state.user)  
  const dispatch = useDispatch()
  
  if(userReduce.id){
    return <Navigate to="/" />;
  }


  const checkLoginInput = async () => {
    let checkResult = dispatch(signInCheckTextInput())
    if(!checkResult.success){
      return
    }

    const result = await dispatch(signInAsync({id:signInReduce.id,password:signInReduce.password}))
    if(result.payload.status == "Error"){
      return
    }
    const userLogedIn = {
      id : result.payload.data.id,
      name: result.payload.data.name,
      company : result.payload.data.company,
      position : result.payload.data.position
    }

    dispatch(setUser(userLogedIn))

  }

  const checkRegisterInput = async () => {
    let checkResult = dispatch(signUpCheckTextInput())
    if(!checkResult.success){
      return
    }

    const params = {
      id: signUpReduce.id,
      name : signUpReduce.fullName,
      password: signUpReduce.password,
      password2: signUpReduce.password2
    }

    const result = await dispatch(registerNewUserAsync(params))

    if(result.payload.status == "Error"){
      return
    }
    const userLogedIn = {
      id : result.payload.data.id,
      name: result.payload.data.name,
      company : result.payload.data.company,
      position : result.payload.data.position
    }
    dispatch(setUser(userLogedIn))
  }

  const loginOnSubmit = (e) => {
    e.preventDefault()
    checkLoginInput()
  }

  const registerOnSubmit = (e) => {
    e.preventDefault()
    checkRegisterInput()
  }

  return (
    <section className="container">
      <div className='sign-in-up'>
        <div className='login-section'>
        {signInReduce.loginErrorAlert.show ? <div className="alert alert-danger">{signInReduce.loginErrorAlert.message}</div> : null}

        <h1 className="large text-primary">Sign In</h1>
        <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
        <form onSubmit={e => loginOnSubmit(e)}>
            <TextField 
                style ={{width: '18rem'}}
                value={signInReduce.id} 
                onChange={e => dispatch(signInIdChange({id: e.target.value}))}
                helperText="Please enter your ID." 
                id="filled-basic"  
                name='id' 
                label="ID" 
                variant="filled" 
                error={signInReduce.errorHelper.idInput}
            />

            <TextField 
              style ={{width: '18rem'}}
              value={signInReduce.password} 
              onChange={e => dispatch(signInPasswordChange({password: e.target.value}))}
              helperText="Please enter your password." 
              id="filled-basic"  
              name='password' 
              label="Password" 
              variant="filled" 
              type="password"
              error={signInReduce.errorHelper.passwordInput}
            />
          <br/>
          <br/>
          <Button type="submit" variant="contained" color="primary">Login</Button>

        </form>
        </div>

        <div className='register-section'>
        {signUpReduce.registerErrorAlert.show ? <div className="alert alert-danger">{signUpReduce.registerErrorAlert.message}</div> : null}

          <h1 className="large text-primary">Sign Up</h1>
          <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
          <form onSubmit={e => registerOnSubmit(e)}>
            <FormControl>
              <TextField 
                style ={{width: '18rem'}}
                value={signUpReduce.id} 
                onChange={e => dispatch(signUpIdChange({id:e.target.value}))}
                helperText="Please enter your ID" 
                id="filled-basic"  
                name='id' 
                label="Id" 
                variant="filled" 
                error={signUpReduce.errorHelper.idInput}
              />

              <TextField 
                style ={{width: '18rem'}}
                value={signUpReduce.name}  
                onChange={e => dispatch(signUpFullName({name:e.target.value}))}
                helperText="Please enter your full name" 
                id="filled-basic"  
                name='name' 
                label="Full name" 
                variant="filled" 
                error={signUpReduce.errorHelper.fullNameInput}

              />

              <TextField 
                style ={{width: '18rem'}}
                value={signUpReduce.password}  
                onChange={e => dispatch(signUpPasswordChange({password:e.target.value}))}
                helperText={signUpReduce.errorHelper.passwordInputText} 
                id="filled-basic"  
                name='password' 
                label="Password" 
                variant="filled" 
                type="password"
                error={signUpReduce.errorHelper.passwordInput}

              />

              <TextField 
                style ={{width: '18rem'}}
                value={signUpReduce.password2}  
                onChange={e => dispatch(signUpConfirmPasswordChange({password:e.target.value}))}
                helperText={signUpReduce.errorHelper.passwordInputText} 
                id="filled-basic"  
                name='password2' 
                label="Confirm Password" 
                variant="filled" 
                type="password"
                error={signUpReduce.errorHelper.passwordInput2}

              />
            </FormControl>
            <br />
            <br />
            <Button type="submit" variant="contained" color="primary">Register</Button>
          </form>
        </div>
      </div>


  </section>
  )
}

export default SignInUp