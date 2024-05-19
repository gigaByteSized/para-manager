import { Box, Button, Grid, useTheme } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import EditCalendarIcon from "@mui/icons-material/EditCalendar"

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
import { AddModal } from "./modals/AddModal"
import { EditModal } from "./modals/EditModal"
import { Check } from "@mui/icons-material"

const QuickSearchToolbar = (props) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [openAdd, setOpenAdd] = useState(false)
  const handleOpenAdd = () => setOpenAdd(true)
  const handleCloseAdd = () => setOpenAdd(false)

  return (
    <Box
      sx={{
        display: "flex",
        p: 0.5,
        pb: 1,
        justifyContent: "space-between",
      }}
    >
      <Button
        variant="contained"
        onClick={handleOpenAdd}
        endIcon={<EditCalendarIcon />}
        sx={{
          backgroundColor: colors.greenAccent[600],
          color: colors.grey[100],
          "&:hover": {
            backgroundColor: colors.greenAccent[800],
          },
        }}
      >
        Add Service Schedule
      </Button>
      <AddModal
        open={openAdd}
        close={handleCloseAdd}
        callback={props.fetchCallback}
      />

      <GridToolbarQuickFilter />
    </Box>
  )
}

export const CalendarGrid = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [rows, setRows] = useState([])
  const [openEdit, setOpenEdit] = useState(false)
  const [editContext, setEditContext] = useState("")
  const handleOpenEdit = () => setOpenEdit(true)
  const handleCloseEdit = () => setOpenEdit(false)

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  })

  const calendarColRef = collection(db, "calendar")

  useEffect(() => {
    fetchAgencies()
  }, [])

  const fetchAgencies = async () => {
    const data = await getDocs(calendarColRef)
    setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  }

  const apiRef = useGridApiRef()

  const columns: GridColDef[] = [
    { field: "service_id", headerName: "Service ID", flex: 3 },
    {
      field: "monday",
      headerName: "Monday",
      align: "center",
      headerAlign: "center",
      flex: 2,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return <>{params.row.monday === 1 ? <Check /> : null}</>
      },
    },
    {
      field: "tuesday",
      headerName: "Tuesday",
      align: "center",
      headerAlign: "center",
      flex: 2,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return <>{params.row.tuesday === 1 ? <Check /> : null}</>
      },
    },
    {
      field: "wednesday",
      headerName: "Wednesday",
      align: "center",
      headerAlign: "center",
      flex: 2,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return <>{params.row.wednesday === 1 ? <Check /> : null}</>
      },
      // width: 90,
    },
    {
      field: "thursday",
      headerName: "Thursday",
      align: "center",
      headerAlign: "center",
      // width: 70,

      flex: 2,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return <>{params.row.thursday === 1 ? <Check /> : null}</>
      },
    },
    {
      field: "friday",
      headerName: "Friday",
      align: "center",
      headerAlign: "center",
      // width: 110,
      flex: 2,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return <>{params.row.friday === 1 ? <Check /> : null}</>
      },
    },
    {
      field: "saturday",
      headerName: "Saturday",
      align: "center",
      headerAlign: "center",
      flex: 2,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return <>{params.row.saturday === 1 ? <Check /> : null}</>
      },
    },
    {
      field: "sunday",
      headerName: "Sunday",
      align: "center",
      headerAlign: "center",
      flex: 2,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return <>{params.row.sunday === 1 ? <Check /> : null}</>
      },
      // width: 130,
    },
    {
      field: "start_date",
      headerName: "Start Date",
      align: "center",
      headerAlign: "center",
      flex: 2,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "end_date",
      headerName: "End Date",
      align: "center",
      headerAlign: "center",
      flex: 2,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "action",
      headerName: "Action",
      align: "center",
      headerAlign: "center",
      sortable: false,
      flex: 1.5,

      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container spacing={0.3}>
            <Grid
              item
              xs={6}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <EditIcon
                sx={{
                  "&:hover": {
                    color: colors.greenAccent[500],
                    cursor: "pointer",
                  },
                }}
                onClick={() => editService(params.id, params.row)}
              />
            </Grid>
            <Grid
              item
              xs={6}
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
                  deleteService(params.row.id)
                }}
              />
            </Grid>
          </Grid>
        )
      },
    },
  ]

  const editService = (id: any, initialValues: any) => {
    rows.forEach((e) => {
      if (e.service_id === id) {
        initialValues.id = e.id
        {
          return
        }
      }
    })
    setEditContext(initialValues)
    handleOpenEdit()
  }

  const deleteService = (id: any) => {
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
    const docRef = doc(db, "calendar", id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      Swal.fire({
        title: "Error",
        text: "Service not found",
        icon: "error",
        background: theme.palette.background.default,
        color: colors.grey[100],
        timer: 1500,
      })
    }

    await deleteDoc(docRef)
    Swal.fire({
      title: "Deleted!",
      text: `Service ID ${docSnap.data().service_id}, has been deleted.`,
      icon: "success",
      background: theme.palette.background.default,
      color: colors.grey[100],
      timer: 1500,
    })
    fetchAgencies()
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
        getRowId={(row) => row.service_id}
        apiRef={apiRef}
        slots={{
          toolbar: (props) => (
            <QuickSearchToolbar {...props} fetchCallback={fetchAgencies} />
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
      <EditModal
        open={openEdit}
        close={handleCloseEdit}
        callback={fetchAgencies}
        initialValues={editContext}
      />
    </Box>
  )
}
