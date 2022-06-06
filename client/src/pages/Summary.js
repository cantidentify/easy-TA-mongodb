import React, { useEffect, useState } from 'react'
import api from '../utils/api';
import { Link } from 'react-router-dom'
import Grid from '../components/Grid';
import CircleIcon from '@mui/icons-material/Circle';
import Chip from "@material-ui/core/Chip";


import Timer from '../components/Timer';
import { green, orange } from '@mui/material/colors';

const Summary = () => {
  const [rows,setRows] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get('/clocking/clockList')
      let clockingList = []
      let id = 1
      res.data.data.map(e => {

        let btnStatus = 0
        if (e.status == "normal"){
          btnStatus = 1
        }

        let buffer = {
          id : id,
          col1: btnStatus,
          col2: e.id,
          col3: e.date,
          col4: e.time,
          col5: e.type,
          col6: e.status,
        }
        id++
        clockingList.push(buffer)

      })
      setRows(clockingList);
    }
  
    fetchData()
      .catch(console.error);;
  }, [])


  const columns = [
    { 
      field: 'col1', sortable: false,
    renderCell: (params) => {
      return <Chip style={{backgroundColor:'white'}} size='medium' {...renderIcon(params)}/>;
    }, headerName: 'Status', width: 150, headerAlign: 'center', },
    { 
      field: 'col2', headerName: 'Id', width: 150, headerAlign: 'center',
    },
    { field: 'col3', headerName: 'Clock Date', width: 200, headerAlign: 'center', },
    { field: 'col4', headerName: 'Clock Time', width: 200, headerAlign: 'center', },
    { field: 'col5', headerName: 'Type', width: 150, headerAlign: 'center', },
    { field: 'col6', headerName: 'Status', width: 150, headerAlign: 'center', }
  ];
  return (
    <section className='container'>
      <div className='other-menu'>
        <h1 className="large">Clocking History</h1>
        <br/>
        <div className='timer-center'>
          <h1 className='large'>{<Timer/>}</h1>
        </div>
        <div style={{ height: '24rem', width: '100%' }}>
          <Grid row={rows} column={columns}/>
        </div>
      </div>
    </section>


  )
}

function renderIcon(params){
  if(params.value == 1){
    return{
      icon : <CircleIcon style={{ fill: green[600] }}/>,

    }
  }
  if(params.value == 0){
    return{
      icon : <CircleIcon style={{ fill: orange[500] }}/>,

    }
  }
}

export default Summary