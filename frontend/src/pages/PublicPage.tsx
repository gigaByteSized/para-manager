import React, { useState } from "react"
import { Box, Button, Grid } from "@mui/material"
import {
  DataGrid,
  GridColDef,
  GridRowModel,
  GridValueGetterParams,
} from "@mui/x-data-grid"
import UploadFileIcon from "@mui/icons-material/UploadFile"
import { handleUpload } from "../api/GTFS Manager/hooks/fileHandler"
// import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
// import Banner from '../modules/general/Banner'
// import Footer from '../modules/general/Footer'
// import Navbar from '../modules/general/Navbar'

// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

interface IProps {
  children?: React.ReactNode
}

const PublicPage: React.FC<IProps> = () => {
  // const theme = useTheme();
  // const [filename, setFilename] = useState("");
  const [columns, setColumns] = useState<GridColDef[]>([])
  const [rows, setRows] = useState<GridRowModel[]>([])

  const handleColumnsUpdate = (
    newColumns: React.SetStateAction<GridColDef[]>
  ) => {
    console.log(newColumns)
    setColumns(newColumns)
  }

  const handleRowsUpdate = (newRows: React.SetStateAction<GridRowModel[]>) => {
    setRows(newRows)
  }

  return (
    <Box sx={{ width: "100vw", height: "100vh" }}>
      <Button
        component="label"
        variant="contained"
        startIcon={<UploadFileIcon />}
        sx={{ marginRight: "1rem" }}
      >
        Upload GTFS
        <input
          type="file"
          accept=".zip"
          hidden
          onChange={(e) =>
            handleUpload(e, handleColumnsUpdate, handleRowsUpdate)
          }
        />
      </Button>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row: any) => {
          let key = ""

          Object.keys(row).map((k) => {
            if (k.includes("_id")) {
              key = k
            }
          })
          return row[key]
          // console.log(row)
          // return row
          // if (row.includes("_id")) {
          //   return row
          // }
        }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
      {/* <Footer /> */}
    </Box>
  )
}

export default PublicPage
