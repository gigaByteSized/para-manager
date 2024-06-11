import { Box, Button, Grid, Tooltip, useTheme } from "@mui/material"
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined"

import { DataGrid, GridColDef, GridToolbarQuickFilter } from "@mui/x-data-grid"

import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

import { tokens } from "../../theme"
import { EditModal } from "./modals/EditModal"
import { collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore"
import { db } from "../../firebase-config"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { AddModal } from "./modals/AddModal"
import { ParaRouteTypeToGTFS } from "../../services/ParaRouteTypeToGTFS"
import { saveAs } from "file-saver"

const QuickSearchToolbar = (props) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [openAdd, setOpenAdd] = useState(false)
  const handleOpenAdd = () => setOpenAdd(true)
  const handleCloseAdd = () => setOpenAdd(false)

  const fetchRoutes = async (): Promise<any> => {
    const routesCollection = collection(db, "routes")
    const routesSnapshot = await getDocs(routesCollection)
    return routesSnapshot.docs.map((doc) => doc.data())
  }

  // const generateRoutesTxt = (routes: any[]): string => {
  //   const headers = [
  //     "route_id",
  //     "agency_id",
  //     "route_short_name",
  //     "route_long_name",
  //     "route_desc",
  //     "route_type",
  //     "route_url",
  //     "route_color",
  //     "route_text_color",
  //   ]

  //   const routesData = routes.map((route) => {
  //     return [
  //       route.route_id || "",
  //       route.agency_id || "",
  //       route.route_short_name || "",
  //       route.route_long_name || "",
  //       route.route_desc || "",
  //       ParaRouteTypeToGTFS(route.route_type).toString(),
  //       route.route_url || "",
  //       route.route_color || "",
  //       route.route_text_color || "",
  //     ].join(",")
  //   })

  //   return [headers.join(","), ...routesData].join("\n")
  // }

  // const downloadRoutesTxt = async () => {
  //   const routes = await fetchRoutes()
  //   const routesTxt = generateRoutesTxt(routes)
  //   const blob = new Blob([routesTxt], { type: "text/plain;charset=utf-8" })
  //   saveAs(blob, "routes.txt")
  // }

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
        onClick={handleOpenAdd}
        endIcon={<AddLocationAltOutlinedIcon />}
        sx={{
          backgroundColor: colors.greenAccent[600],
          color: colors.grey[100],
          "&:hover": {
            backgroundColor: colors.greenAccent[700],
          },
        }}
      >
        Add Route
      </Button>
      <AddModal
        open={openAdd}
        close={handleCloseAdd}
        callback={props.fetchCallback}
      />
      {/* <Button
        variant="contained"
        onClick={downloadRoutesTxt}
        sx={{
          backgroundColor: colors.greenAccent[600],
          color: colors.grey[100],
          "&:hover": {
            backgroundColor: colors.greenAccent[700],
          },
        }}
      >
        Download Routes
      </Button> */}
      <GridToolbarQuickFilter />
    </Box>
  )
}

export const RouteGrid = () => {
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

  const routesColRef = collection(db, "routes")

  useEffect(() => {
    fetchRoutes()
  }, [])

  const fetchRoutes = async () => {
    const data = await getDocs(routesColRef)
    setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  }

  const columns: GridColDef[] = [
    {
      field: "route_id",
      headerName: "Route ID",
      flex: 1,
      // width: 110,
    },
    {
      field: "agency_id",
      headerName: "Agency ID",
      flex: 1,
      // width: 70,
    },
    {
      field: "route_short_name",
      headerName: "Route short name",
      flex: 2,
    },
    {
      field: "route_long_name",
      headerName: "Route long name",
      flex: 7,
    },
    {
      field: "route_type",
      headerName: "Route type",
      // width: 150,
      flex: 2,
    },
    {
      field: "route_desc",
      headerName: "Route description",
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
            {params.row.route_desc === "" ? (
              <>
                <Tooltip title="Route has no description" arrow>
                  <span>
                    <Button
                      disabled={params.row.route_desc === ""}
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
                  </span>
                </Tooltip>
              </>
            ) : (
              <>
                <Button
                  disabled={params.row.route_desc === ""}
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
                onClick={() => editRoute(params.id, params.row)}
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
                  deleteRoute(params.row.id)
                }}
              />
            </Grid>
          </Grid>
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

  const deleteRoute = (id: any) => {
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
    const docRef = doc(db, "routes", id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      Swal.fire({
        title: "Error",
        text: "Route not found",
        icon: "error",
        background: theme.palette.background.default,
        color: colors.grey[100],
        timer: 1500,
      })
    }

    await deleteDoc(docRef)
    Swal.fire({
      title: "Deleted!",
      text: `Route ID ${docSnap.data().route_id}, "${
        docSnap.data().route_long_name || docSnap.data().route_short_name
      }" has been deleted.`,
      icon: "success",
      background: theme.palette.background.default,
      color: colors.grey[100],
      timer: 1500,
    })
    fetchRoutes()
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
            <QuickSearchToolbar {...props} fetchCallback={fetchRoutes} />
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
      <EditModal
        open={openEdit}
        close={handleCloseEdit}
        callback={fetchRoutes}
        initialValues={editContext}
      />
    </Box>
  )
}
