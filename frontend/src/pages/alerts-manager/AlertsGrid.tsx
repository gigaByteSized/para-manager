import { Box, Button, Grid, Tooltip, useTheme } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
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
import { AddModal } from "./modals/AddModal"
import { EditModal } from "./modals/EditModal"
import { ViewInMapModal } from "./modals/ViewInMapModal"
import { latLng } from "leaflet"

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
        endIcon={<EditIcon />}
        sx={{
          backgroundColor: colors.greenAccent[600],
          color: colors.grey[100],
          "&:hover": {
            backgroundColor: colors.greenAccent[800],
          },
        }}
      >
        Add Alert
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

export const AlertsGrid = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [rows, setRows] = useState([])
  const [openEdit, setOpenEdit] = useState(false)
  const [editContext, setEditContext] = useState("")
  const handleOpenEdit = () => setOpenEdit(true)
  const handleCloseEdit = () => {
    setOpenEdit(false)
    setShow(false)
  }
  const [openMap, setOpenMap] = useState(false)
  const handleOpenMap = () => setOpenMap(true)
  const handleCloseMap = () => setOpenMap(false)
  const [mapContext, setMapContext] = useState<any>("")
  const [show, setShow] = useState(false)

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  })

  const alertsColRef = collection(db, "_meta-community-alerts")

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    const data = await getDocs(alertsColRef)
    setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  }

  const apiRef = useGridApiRef()

  const columns: GridColDef[] = [
    {
      field: "alertName",
      headerName: "Alert Name",
      // align: "center",
      // headerAlign: "center",
      flex: 3,
    },
    {
      field: "expiryDate",
      headerName: "Expiry Date",
      align: "center",
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            {/* format timestamp to readable date */}
            {new Date(
              params.row.expiryDate?.seconds * 1000
            ).toLocaleDateString()}
          </>
        )
      },
    },

    {
      field: "alertNotes",
      headerName: "Alert Notes",
      align: "center",
      headerAlign: "center",
      sortable: false,
      flex: 1.5,

      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Button
            onClick={() => showAlertNotes(params.row)}
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
      field: "coordinates",
      headerName: "Location",
      align: "center",
      headerAlign: "center",
      sortable: false,
      flex: 1.5,

      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            {/* up to 4 decimal places */}
            {/* Lat: {params.row.coordinates?.latitude} Lng: {params.row.coordinates?.longitude} */}
            Lat: {params.row.coordinates?.latitude.toFixed(4)} Lng:{" "}
            {params.row.coordinates?.longitude.toFixed(4)}
          </>
        )
      },
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
                onClick={() => editAlert(params.id, params.row)}
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
                  deleteAlert(params.row.id)
                }}
              />
            </Grid>
          </Grid>
        )
      },
    },
  ]

  const showAlertNotes = (params) => {
    Swal.fire({
      title: `${params.alertName}`,
      text:
        params.alertNotes === "" || params.alertNotes === undefined
          ? "No description"
          : params.alertNotes,
      icon: "info",
      confirmButtonColor: colors.greenAccent[600],
      background: theme.palette.background.default,
      color: colors.grey[100],
    })
  }

  // const showMap = (id: any) => {
  //   setMapContext(id)
  //   handleOpenMap()
  // }

  const editAlert = (id: any, initialValues: any) => {
    rows.forEach((e) => {
      if (e.service_id === id) {
        initialValues.id = e.id
        {
          return
        }
      }
    })
    setEditContext(initialValues)
    setShow(true)
    handleOpenEdit()
  }

  const deleteAlert = (id: any) => {
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
    const docRef = doc(db, "_meta-community-alerts", id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      Swal.fire({
        title: "Error",
        text: "Alert not found",
        icon: "error",
        background: theme.palette.background.default,
        color: colors.grey[100],
        timer: 1500,
      })
    }

    await deleteDoc(docRef)
    Swal.fire({
      title: "Deleted!",
      text: `${docSnap.data().alertName} has been deleted.`,
      icon: "success",
      background: theme.palette.background.default,
      color: colors.grey[100],
      timer: 1500,
    })
    fetchAlerts()
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
            <QuickSearchToolbar {...props} fetchCallback={fetchAlerts} />
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
      {show ? (
        <EditModal
          open={openEdit}
          close={handleCloseEdit}
          callback={fetchAlerts}
          initialValues={editContext}
        />
      ) : null}

      {/* <ViewInMapModal
        open={openMap}
        close={handleCloseMap}
        alertID={mapContext}
      /> */}
    </Box>
  )
}
