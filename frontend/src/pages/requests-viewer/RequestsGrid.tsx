import { Box, Button, Grid, useTheme } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"

import {
  DataGrid,
  GridColDef,
  GridToolbarQuickFilter,
  useGridApiRef,
} from "@mui/x-data-grid"

import { db } from "../../firebase-config"
import { collection, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore"
import Swal from "sweetalert2"

import { tokens } from "../../theme"
import { useEffect, useState } from "react"

const QuickSearchToolbar = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        p: 0.5,
        pb: 1,
        justifyContent: "space-between",
      }}
    >
      <GridToolbarQuickFilter />
    </Box>
  )
}

export const RequestsGrid = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [rows, setRows] = useState([])
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  })

  const requestsColRef = collection(db, "_meta-route-requests")

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    const data = await getDocs(requestsColRef)
    setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  }

  const apiRef = useGridApiRef()

  const columns: GridColDef[] = [
    {
      field: "requestTitle",
      headerName: "Request Title",
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 0.5,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Button
            onClick={() => showDescription(params.row)}
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: colors.grey[100],
              "&:hover": {
                backgroundColor: colors.greenAccent[700],
              },
            }}
          >
            View
          </Button>
        )
      },
    },
    {
      field: "action",
      headerName: "Action",
      align: "center",
      headerAlign: "center",
      sortable: false,
      flex: 0.5,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DeleteIcon
                sx={{
                  "&:hover": {
                    color: colors.redAccent[500],
                    cursor: "pointer",
                  },
                }}
                onClick={() => {
                  deleteRequest(params.row.id)
                }}
              />
            </Grid>
          </Grid>
        )
      },
    },
  ]

  const deleteRequest = (id: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: colors.greenAccent[600],
      cancelButtonColor: colors.redAccent[500],
      confirmButtonText: "Yes, delete it!",
      background: theme.palette.background.default,
      color: colors.grey[100],
    }).then((result) => {
      if (result.value) {
        deleteApi(id)
      }
    })
  }

  const deleteApi = async (id: string) => {
    const docRef = doc(db, "_meta-route-requests", id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      Swal.fire({
        title: "Error",
        text: "Request not found",
        icon: "error",
        background: theme.palette.background.default,
        color: colors.grey[100],
        timer: 1500,
      })
    }

    await deleteDoc(docRef)
    Swal.fire({
      title: "Deleted!",
      text: `"${docSnap.data().requestTitle}" has been deleted.`,
      icon: "success",
      background: theme.palette.background.default,
      color: colors.grey[100],
      timer: 1500,
    })
    fetchRequests()
  }

  const showDescription = (row) => {
    Swal.fire({
      title: row.requestTitle,
      text: row.description,
      icon: "info",
      background: theme.palette.background.default,
      color: colors.grey[100],
      width: "75%",
    })
  }

  return (
    <Box
      sx={{
        height: "675px",
        width: "100%",
        "& .MuiDataGrid-root": {
          border: "none",
        },
        "& .MuiDataGrid-cell": {
          borderBottom: "none",
        },
        "& .name-column--cell": {
          color: colors.greenAccent[300],
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: colors.blueAccent[700],
          borderBottom: "none",
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: colors.primary[400],
        },
        "& .MuiDataGrid-footerContainer": {
          borderTop: "none",
          backgroundColor: colors.blueAccent[700],
        },
        "& .MuiCheckbox-root": {
          color: `${colors.greenAccent[200]} !important`,
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        apiRef={apiRef}
        slots={{
          toolbar: (props) => (
            <QuickSearchToolbar {...props} fetchCallback={fetchRequests} />
          ),
        }}
        disableRowSelectionOnClick
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 25, 50, 100]}
        sx={{
          root: {
            outline: "none",
          },
          "& .MuiDataGrid-cell:focus-within": {
            outline: "none",
          },
        }}
      />
    </Box>
  )
}