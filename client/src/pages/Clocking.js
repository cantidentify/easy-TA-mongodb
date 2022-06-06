import React, { useState, useEffect } from 'react'
import api from '../utils/api';
import { Button } from '@material-ui/core';
import TextField from "@material-ui/core/TextField";
import FormControl from '@mui/material/FormControl';

import Timer from '../components/Timer';
import ClockingStatus from '../components/ClockingStatus';

// Redux
import {useDispatch, useSelector} from 'react-redux'
import { clockingSuccess, clockingFail, setErrorAlert, onChangeInput, logedIn, initialPage } from '../features/clocking'

const Clocking = () => {
  
  const clockingReduce = useSelector((state) => state.clocking)  
  const userReduce = useSelector((state) => state.user)  
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initialPage())
    if(userReduce.id){
      dispatch(logedIn(userReduce.id))
    }
  }, [])

  const checkClocking = async clockingData => {
    const params = {
      id : clockingReduce.user.id,
      date : clockingData.date
    }
  
    try{
  
      const body = JSON.stringify(params)
      const res = await api.post('/clocking/userClocking',body)
  
      let status , type = ""
      if(res.data.length > 0){
        type = "check-out"
  
        if(clockingData.time < '18:00'){
          status = "early"
        }
        else{
          status = "normal"
        }
      }
      else{
        type = "check-in"
        if(clockingData.time > '9:00'){
          status = "late"
        }
        else{
          status = "normal"
        }
      }
  
      clockingData.status = status
      clockingData.type = type
      
      dispatch(setErrorAlert({show : false, msg:"",class:"alert alert-danger"}))
      return clockingData

    }catch(err){
      dispatch(setErrorAlert({show : true, msg:"Server error please try again.",class:"alert alert-danger"}))
    }
  }

  const onSubmit = async e => {
    e.preventDefault();
    if(!clockingReduce.user.id){
      dispatch(setErrorAlert({show : true, msg:"Please enter your ID.", class: "alert alert-danger"}))
      return
    }
    const clockingData = {
      "id" : clockingReduce.user.id,
      "date" : getDate(),
      "time" : getTime(),
      "type" : "",
      "status" : ""
    }


    var newClocking = await checkClocking(clockingData)
    try{
      const res = await api.post('/clocking/',newClocking)
      let successMsg = "Clocking Success. Thank you for your hard work."
      if(newClocking.type == "check-in"){
        successMsg = "Clocking Success. Good to see you today."
      }
      dispatch(clockingSuccess({
        clockingData : { 
          type : newClocking.type,
          status : newClocking.status,
          show : true
        },
        successMsg : successMsg
      }));
      setTimeout(() => {
        dispatch(initialPage())
      }, 10000);
    } catch (err){
      if(err.response.data.msg == "Already clocked-out. Thank you for today work."){
        dispatch(clockingFail({
          show : true, msg:err.response.data.msg, class:"alert alert-success"
        }));
        return
      }
      const errorMessage = err.response.data.errors[0].msg
      dispatch(clockingFail({
        show : true, msg:errorMessage, class:"alert alert-danger"
      }));
    }

  }

  return (
    <section className="landing">
    <div className="light-overlay">
      <div className="landing-inner">
        <h1 className="x-large">Clocking - In / Out</h1>
        <p className="lead">
        {<Timer/>}
        </p>
        <form onSubmit={e => onSubmit(e)}>
          <FormControl>
              <TextField 
                value={clockingReduce.user.id} 
                onChange={(e) => { 
                  dispatch(onChangeInput({
                    id : e.target.value,
                    show : false,
                    msg:"",
                  }))}} 
                helperText="Please enter your ID." 
                id="filled-basic"  
                name='id' 
                label="ID" 
                variant="filled" 
                disabled={clockingReduce.disableIdInput}
              />
              { 
                clockingReduce.errorAlert.show ? <div className={clockingReduce.errorAlert.class}>{clockingReduce.errorAlert.msg}</div> : null 
              }
              <br/>
              <Button disabled={clockingReduce.disableBtn} type="submit" variant="contained" color="primary">Clocking</Button>
          </FormControl>
        </form>

        {clockingReduce.clockStatus.show? <ClockingStatus type={clockingReduce.clockStatus.type} status={clockingReduce.clockStatus.status} /> : null}


      </div>
    </div>
  </section>
  )
}

function getDate(){
  let d = new Date();
  let month = (d.getMonth() + 1).toString();
  let day = d.getDate().toString();
  let year = d.getFullYear();
  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  }
  return [year, month, day].join('-');
}

function getTime(){
  let now = new Date();
  let current = now.getHours() + ':' + now.getMinutes();
  return current
}



export default Clocking
