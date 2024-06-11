import { Box, Button, Grid, Tooltip, useTheme } from "@mui/material"
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined"

import { DataGrid, GridColDef, GridToolbarQuickFilter } from "@mui/x-data-grid"

import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

import { tokens } from "../../theme"
import { EditModal } from "./modals/EditModal"
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore"
import { db } from "../../firebase-config"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"

const QuickSearchToolbar = (props) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  return (
    <Box
      sx={{
        display: "flex",
        p: 0.5,
        pb: 1,
        justifyContent: "space-between",
        // alignContent:"center"
      }}
    >
      <Button
        variant="contained"
        href="/trips/wizard"
        endIcon={<AddLocationAltOutlinedIcon />}
        sx={{
          backgroundColor: colors.greenAccent[600],
          color: colors.grey[100],
          "&:hover": {
            backgroundColor: colors.greenAccent[700],
          },
        }}
      >
        Add Trip
      </Button>
      {/* <Button
        variant="contained"
        onClick={exportGtfsData}
        sx={{
          backgroundColor: colors.greenAccent[600],
          color: colors.grey[100],
          "&:hover": {
            backgroundColor: colors.greenAccent[700],
          },
        }}
      >
        Export GTFS
      </Button> */}
      {/* <KmlGenerator latlongArray={latlongArray} /> */}
      <GridToolbarQuickFilter />
    </Box>
  )
}

export const TripGrid = () => {
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

  const tripsColRef = collection(db, "trips")
  const [frequencyRows, setFrequencyRows] = useState([])
  const [stopTimesRows, setStopTimesRows] = useState([])
  const [shapeRows, setShapeRows] = useState([])

  const frequencyColRef = collection(db, "frequencies")
  const stopTimesColRef = collection(db, "stop_times")
  const shapesColRef = collection(db, "shapes")

  useEffect(() => {
    fetchTrips()
    // fetchFrequencies()
  }, [])

  const fetchTrips = async () => {
    const data = await getDocs(tripsColRef)
    setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  }

  const fetchFrequencies = async () => {
    const data = await getDocs(frequencyColRef)
    setFrequencyRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  }

  const fetchStopTimes = async () => {
    const data = await getDocs(stopTimesColRef)
    setStopTimesRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  }

  const fetchShapes = async () => {
    const data = await getDocs(shapesColRef)
    setShapeRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  }

  const columns: GridColDef[] = [
    {
      field: "route_id",
      headerName: "Route ID",
      flex: 1,
      // width: 110,
    },
    {
      field: "service_id",
      headerName: "Service ID",
      flex: 1,
      // width: 70,
    },
    {
      field: "trip_id",
      headerName: "Route short name",
      flex: 2,
    },
    {
      field: "frequency_ref",
      headerName: "Trip Frequencies",
      sortable: false,
      align: "center",
      headerAlign: "center",
      // width: 160,
      flex: 1.25,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <>
              <Button
                onClick={() => showRouteDesc(params.row)}
                sx={{
                  backgroundColor:
                    params.row.route_desc != ""
                      ? colors.greenAccent[600]
                      : colors.grey[500],
                  color: colors.grey[100],
                  "&:hover": {
                    backgroundColor: colors.greenAccent[700],
                  },
                }}
              >
                View
              </Button>
            </>
          </Box>
        )
      },
    },
    {
      field: "action",
      headerName: "Action",
      align: "center",
      headerAlign: "center",
      sortable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          // <Grid container spacing={0.3}>
          //   <Grid
          //     item
          //     xs={6}
          //     sx={{
          //       display: "flex",
          //       alignItems: "center",
          //       justifyContent: "center",
          //     }}
          //   >
          //     <EditIcon
          //       sx={{
          //         "&:hover": {
          //           color: colors.greenAccent[500],
          //           cursor: "pointer",
          //         },
          //       }}
          //       onClick={() => editRoute(params.id, params.row)}
          //     />
          //     <EditModal
          //       open={openEdit}
          //       close={handleCloseEdit}
          //       callback={fetchTrips}
          //       initialValues={editContext}
          //     />
          //   </Grid>
          //   <Grid
          //     item
          //     xs={6}
          //     sx={{
          //       display: "flex",
          //       alignItems: "center",
          //       justifyContent: "center",
          //     }}
          //   >
          //   </Grid>
          // </Grid>
              <DeleteIcon
                sx={{
                  "&:hover": {
                    color: colors.redAccent[500],
                    cursor: "pointer",
                  },
                }}
                onClick={() => {
                  deleteTrip(params.row.id, params.row.trip_id)
                }}
              />
        )
      },
    },
  ]

  const showRouteDesc = (params) => {
    Swal.fire({
      title: `Route ID ${params.route_id}`,
      text:
        params.route_desc === "" || params.route_desc === undefined
          ? "No description"
          : params.route_desc,
      icon: "info",
      confirmButtonColor: colors.greenAccent[600],
      background: theme.palette.background.default,
      color: colors.grey[100],
    })
  }

  const editRoute = (id: any, initialValues: any) => {
    rows.forEach((e) => {
      if (e.agency_id === id) {
        initialValues.id = e.id
        {
          return
        }
      }
    })
    setEditContext(initialValues)
    handleOpenEdit()
  }

  const deleteTrip = (id: any, trip_id) => {
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
        deleteApi(id, trip_id)
      }
    })
  }

  const deleteApi = async (id: string, trip_id) => {
    // const docRef = doc(db, "routes", id)
    // const docSnap = await getDoc(docRef)

    // const snapshot = await firestore.collection('messages').where('text', '==', '').get();
    const stopTimesSnapshot = await getDocs(
      query(collection(db, "stop_times"), where("trip_id", "==", trip_id))
    )

    if (!stopTimesSnapshot.docs.length) {
      Swal.fire({
        title: "Error",
        text: `Stop times for ${trip_id} not found, contact admin for manual deletion.`,
        icon: "error",
        background: theme.palette.background.default,
        color: colors.grey[100],
        timer: 3000,
      })
    }

    stopTimesSnapshot.docs.forEach(async (doc) => {
      await deleteDoc(doc.ref)
    })

    const frequenciesSnapshot = await getDocs(
      query(collection(db, "frequencies"), where("trip_id", "==", trip_id))
    )

    if (!frequenciesSnapshot.docs.length) {
      Swal.fire({
        title: "Error",
        text: `Frequencies for ${trip_id} not found, contact admin for manual deletion.`,
        icon: "error",
        background: theme.palette.background.default,
        color: colors.grey[100],
        timer: 3000,
      })
    }

    frequenciesSnapshot.docs.forEach(async (doc) => {
      await deleteDoc(doc.ref)
    })

    const shapesSnapshot = await getDocs(
      query(collection(db, "shapes"), where("shape_id", "==", trip_id))
    )

    if (!shapesSnapshot.docs.length) {
      Swal.fire({
        title: "Error",
        text: `Shapes for ${trip_id} not found, contact admin for manual deletion.`,
        icon: "error",
        background: theme.palette.background.default,
        color: colors.grey[100],
        timer: 3000,
      })
    }

    shapesSnapshot.docs.forEach(async (doc) => {
      await deleteDoc(doc.ref)
    })

    const tripsSnapshot = await getDocs(
      query(collection(db, "trips"), where("trip_id", "==", trip_id))
    )

    if (!tripsSnapshot.docs.length) {
      Swal.fire({
        title: "Error",
        text: "Trip not found",
        icon: "error",
        background: theme.palette.background.default,
        color: colors.grey[100],
        timer: 3000,
      })
    }

    tripsSnapshot.docs.forEach(async (doc) => {
      await deleteDoc(doc.ref)
    })

    // const MAX_WRITES_PER_BATCH = 500 /** https://cloud.google.com/firestore/quotas#writes_and_transactions */

    /**
     * `chunk` function splits the array into chunks up to the provided length.
     * You can get it from either:
     * - [Underscore.js](https://underscorejs.org/#chunk)
     * - [lodash](https://lodash.com/docs/4.17.15#chunk)
     * - Or one of [these answers](https://stackoverflow.com/questions/8495687/split-array-into-chunks#comment84212474_8495740)
     */
    // const batches = _.chunk(snapshot.docs, MAX_WRITES_PER_BATCH)
    // const commitBatchPromises = []

    // batches.forEach((batch) => {
    //   // const wb = writeBatch()
    //   batch.forEach((doc) => writeBatch(db).delete(doc.ref))
    //   commitBatchPromises.push(writeBatch(db).commit())
    // })

    // await Promise.all(commitBatchPromises)

    // if (!docSnap.exists()) {
    //   Swal.fire({
    //     title: "Error",
    //     text: "Route not found",
    //     icon: "error",
    //     background: theme.palette.background.default,
    //     color: colors.grey[100],
    //     timer: 1500,
    //   })
    // }

    Swal.fire({
      title: "Deleted!",
      text: `Trip ID ${trip_id} has been deleted.`,
      icon: "success",
      confirmButtonColor: colors.greenAccent[600],
      cancelButtonColor: colors.redAccent[500],
      background: theme.palette.background.default,
      color: colors.grey[100],
      timer: 1500,
    })

    fetchTrips()
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
        getRowId={(row) => row.route_id}
        columns={columns}
        slots={{
          toolbar: (props) => (
            <QuickSearchToolbar {...props} fetchCallback={fetchTrips} />
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
        // disableColumnFilter
        // disableColumnSelector
        // disableDensitySelector
      />
    </Box>
  )
}
