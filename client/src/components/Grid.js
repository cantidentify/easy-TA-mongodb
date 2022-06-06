import React from 'react'
import { DataGrid } from '@mui/x-data-grid';

const Grid = ({row,column}) => {
  return (
    <DataGrid disableSelectionOnClick rows={row} columns={column} />
  )
}

export default Grid