import { Box, Button, Grid, Tooltip, useTheme } from "@mui/material"
import TransitEnterexitIcon from "@mui/icons-material/TransitEnterexit"
import PreviewIcon from "@mui/icons-material/Preview"
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
import { saveAs } from "file-saver"

const QuickSearchToolbar = (props) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [openAdd, setOpenAdd] = useState(false)
  const handleOpenAdd = () => setOpenAdd(true)
  const handleCloseAdd = () => setOpenAdd(false)

  const viewInNewWindow = () => {
    window.open("/stops/viewer", "_blank", "popup")
  }

  const fetchStops = async (): Promise<any> => {
    const stopsCollection = collection(db, "stops")
    const stopsSnapshot = await getDocs(stopsCollection)
    const stopsList = stopsSnapshot.docs.map((doc) => doc.data())
    return stopsList
  }

  const generateStopsTxt = (stops: any): string => {
    const headers = [
      "stop_id",
      "stop_name",
      "stop_desc",
      "stop_lat",
      "stop_lon",
      "zone_id",
      "stop_url",
      "location_type",
      "parent_station",
      "stop_timezone",
      "wheelchair_boarding",
    ]

    const stopsData = stops.map((stop) => {
      return [
        stop.stop_id || "",
        stop.stop_name || "",
        stop.stop_desc || "",
        stop.stop_lat !== undefined ? stop.stop_lat.toString() : "",
        stop.stop_lon !== undefined ? stop.stop_lon.toString() : "",
        "", // zone_id
        "", // stop_url
        "", // location_type
        "", // parent_station
        "", // stop_timezone
        "", // wheelchair_boarding
      ].join(",")
    })

    return [headers.join(","), ...stopsData].join("\n")
  }

  const downloadStopsTxt = async () => {
    const stops = await fetchStops()
    const stopsTxt = generateStopsTxt(stops)
    const blob = new Blob([stopsTxt], { type: "text/plain;charset=utf-8" })
    saveAs(blob, "stops.txt")
  }

  return (
    <Box
      sx={{
        display: "flex",
        p: 0.5,
        pb: 1,
        justifyContent: "space-between",
      }}
    >
      <Box sx={{}}>
        <Button
          variant="contained"
          onClick={handleOpenAdd}
          endIcon={<TransitEnterexitIcon />}
          sx={{
            backgroundColor: colors.greenAccent[600],
            color: colors.grey[100],
            "&:hover": {
              backgroundColor: colors.greenAccent[800],
            },
          }}
        >
          Add Stop Node
        </Button>
        <AddModal
          open={openAdd}
          close={handleCloseAdd}
          callback={props.fetchCallback}
        />
        <Button
          variant="contained"
          endIcon={<PreviewIcon />}
          // href="/stops/viewer"
          onClick={viewInNewWindow}
          // onClick={}
          sx={{
            ml: 1,
            backgroundColor: colors.greenAccent[600],
            color: colors.grey[100],
            "&:hover": {
              backgroundColor: colors.greenAccent[800],
            },
          }}
        >
          View All Stops
        </Button>
        <Button
          variant="contained"
          endIcon={<PreviewIcon />}
          onClick={downloadStopsTxt}
          sx={{
            ml: 1,
            backgroundColor: colors.greenAccent[600],
            color: colors.grey[100],
            "&:hover": {
              backgroundColor: colors.greenAccent[800],
            },
          }}
        >
          Download Stops
        </Button>
      </Box>
      <GridToolbarQuickFilter />
    </Box>
  )
}

export const StopsGrid = () => {
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

  const stopsColRef = collection(db, "stops")

  useEffect(() => {
    fetchStops()
  }, [])

  const fetchStops = async () => {
    const data = await getDocs(stopsColRef)
    setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))

    // return 1
    // setViewRows(rows)
  }

  const apiRef = useGridApiRef()

  const columns: GridColDef[] = [
    { field: "stop_id", headerName: "Stop ID", flex: 1 },
    {
      field: "stop_name",
      headerName: "Stop Name",
      flex: 4,
    },
    {
      field: "stop_lat",
      headerName: "Latitude",
      flex: 2,
    },
    {
      field: "stop_lon",
      headerName: "Longitude",
      flex: 2,
    },
    {
      field: "stop_desc",
      headerName: "Description",
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
            {params.row.stop_desc === "" ? (
              <>
                <Tooltip title="Stop has no description" arrow>
                  <span>
                    <Button
                      disabled={params.row.stop_desc === ""}
                      onClick={() => showStopDesc(params.row)}
                      sx={{
                        backgroundColor:
                          params.row.stop_desc != ""
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
                  </span>
                </Tooltip>
              </>
            ) : (
              <>
                <Button
                  disabled={params.row.stop_desc === ""}
                  onClick={() => showStopDesc(params.row)}
                  sx={{
                    backgroundColor:
                      params.row.stop_desc != ""
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
            )}
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
                onClick={() => editStop(params.id, params.row)}
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
                  deleteStop(params.row.id)
                }}
              />
            </Grid>
          </Grid>
        )
      },
    },
  ]

  const editStop = (id: any, initialValues: any) => {
    rows.forEach((e) => {
      if (e.stop_id === id) {
        initialValues.id = e.id
        initialValues.agency_id = "LTFRB"
        {
          return
        }
      }
    })

    setEditContext(initialValues)
    handleOpenEdit()
  }

  const deleteStop = (id: any) => {
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
    const docRef = doc(db, "stops", id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      Swal.fire({
        title: "Error",
        text: "Stop not found",
        icon: "error",
        background: theme.palette.background.default,
        color: colors.grey[100],
        timer: 1500,
      })
    }

    await deleteDoc(docRef)
    Swal.fire({
      title: "Deleted!",
      text: `Stop ID ${docSnap.data().stop_id}, "${
        docSnap.data().stop_name
      }" has been deleted.`,
      icon: "success",
      background: theme.palette.background.default,
      color: colors.grey[100],
      timer: 1500,
    })
    fetchStops()
  }

  const showStopDesc = (params) => {
    Swal.fire({
      title: `Stop ID ${params.stop_id}`,
      text:
        params.stop_desc === "" || params.stop_desc === undefined
          ? "No description"
          : params.stop_desc,
      icon: "info",
      confirmButtonColor: colors.greenAccent[600],
      background: theme.palette.background.default,
      color: colors.grey[100],
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
        getRowId={(row) => row.stop_id}
        apiRef={apiRef}
        slots={{
          toolbar: (props) => (
            <QuickSearchToolbar {...props} fetchCallback={fetchStops} />
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
        callback={fetchStops}
        initialValues={editContext}
      />
    </Box>
  )
}
