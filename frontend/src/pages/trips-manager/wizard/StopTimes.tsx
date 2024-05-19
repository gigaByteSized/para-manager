import Typography from "@mui/material/Typography"
import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  useTheme,
} from "@mui/material"
import { LeafletMap } from "../../../components/LeafletMap"
import { useEffect, useState } from "react"
import { getCurrentPosition } from "../../../services/GetCurrentPosition"
import { tokens } from "../../../theme"
import { FixedSizeList, ListChildComponentProps } from "react-window"
import {
  DataGrid,
  GridColDef,
  GridEventListener,
  GridRowModel,
} from "@mui/x-data-grid"
import { getDirections } from "../../../api/ors_api"

export const StopTimes = (props) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const [tempOrsRes, setTempOrsRes] = useState(null)
  const [orsRoute, setOrsRoute] = useState(null)
  const [waiting, setWaiting] = useState(false)
  const [toUpdate, setToUpdate] = useState(null)
  const [error, setError] = useState(null)

  const fetchDirections = async (coordinates: any[]) => {
    try {
      const result = await getDirections(coordinates)
      console.log(result)
      setTempOrsRes(result)
    } catch (error) {
      setError("Failed to fetch directions")
    }
  }

  const interval = props.orsRes.routes[0].summary.duration / props.numNodes
  const [roundtripDuration, setRoundtripDuration] = useState(
    props.orsRes.routes[0].summary.duration
  )
  const [selectedPair, setSelectedPair] = useState([])
  const [pairValues, setPairValues] = useState([])
  const markers = props.markers
  const [selectedMarkers, setSelectedMarkers] = useState([])

  const [pairs, setPairs] = useState([])
  const [loaded, setLoaded] = useState(false)

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 100,
    page: 0,
  })

  const selectPair = (pair) => {
    setSelectedPair(pair)
  }

  const fetchSelectedMarkers = () => {
    const nodeConcat = props.abNodes.concat(props.bcaNodes)
    var selectedMarkers = []

    for (let i = 0; i < nodeConcat.length; i++) {
      const node = nodeConcat[i]
      const marker = markers.find(
        (marker) =>
          marker.position.lat === node[1][1] &&
          marker.position.lng === node[1][0]
      )
      if (marker) {
        selectedMarkers.push(marker)
      }
    }
    setSelectedMarkers(selectedMarkers)
  }

  const createPairsFromMarkers = (markers) => {
    let pairs = []
    let pairValues = []

    for (let i = 1; i < selectedMarkers.length; i++) {
      pairs.push([selectedMarkers[i - 1], selectedMarkers[i]])
      pairValues.push(interval)
    }
    setPairs(pairs)
    setPairValues(pairValues)
    setLoaded(true)
  }

  const rows = pairs.map((pair, index) => ({
    id: index + 1,
    origin: pair[0].tooltip,
    destination: pair[1].tooltip,
    duration: pairValues[index],
  }))

  useEffect(() => {
    fetchSelectedMarkers()
    createPairsFromMarkers(selectedMarkers)
    // console.log(rows)
  }, [loaded])

  useEffect(() => {
    handleLoad()
  }, [pairValues])

  useEffect(() => {
    if (toUpdate !== null) {
      const updatedRow = {
        ...toUpdate,
        duration: tempOrsRes.routes[0].summary.duration,
      }
      processRowUpdate(updatedRow)

      setToUpdate(null)
    }
  }, [tempOrsRes, toUpdate])

  // useEffect(() => {
  //   console.log(props.abNodes)
  //   console.log(props.bcaNodes)
  // }, [props.abNodes, props.bcaNodes])

  const handleLoad = () => {
    props.onUpdateDurations(rows.map((row) => row.duration as number))
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 10 },
    { field: "origin", headerName: "Origin", flex: 1.25 },
    { field: "destination", headerName: "Destination", flex: 1.25 },
    {
      field: "duration",
      headerName: "Duration (s)",
      editable: true,
      type: "number",
      flex: 0.5,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 0.5,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Button
            sx={{
              //   "&:hover": {
              //     color: colors.greenAccent[500],
              //     cursor: "pointer",
              //   },
              // }}
              // sx: {
              // ...btnUnselectedConfigs.sx,
              backgroundColor: colors.blueAccent[600],
              color: colors.grey[100],
              "&:hover": {
                backgroundColor: colors.blueAccent[700],
              },
            }}
            // onClick={() => editStop(params.id, params.row)}
            disabled={waiting}
            onClick={async () => {
              setWaiting(true)
              fetchDirections([
                [
                  pairs[params.row.id - 1][0].position.lng,
                  pairs[params.row.id - 1][0].position.lat,
                ],
                [
                  pairs[params.row.id - 1][1].position.lng,
                  pairs[params.row.id - 1][1].position.lat,
                ],
              ])
                .catch((error) => {
                  console.error(error)
                })
                .finally(() => {
                  setWaiting(false)
                  setToUpdate(params.row)

                  // setTempOrsRes(null)
                })
            }}
          >
            Fetch
          </Button>
        )
      },
    },
  ]

  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    setSelectedPair(pairs[params.row.id - 1])
  }

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRows = rows.map((row) => (row.id === newRow.id ? newRow : row))
    setPairValues(updatedRows.map((row) => row.duration as number))
    props.onUpdateDurations(updatedRows.map((row) => row.duration as number)) // Call the parent's callback

    setRoundtripDuration(
      updatedRows
        .map((row) => row.duration as number)
        .reduce((a, b) => a + b, 0)
    )
    return newRow
  }

  return (
    <>
      <Typography variant="h4" mb={3}>
        Stop Times Fine Tuner
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box
            sx={{
              height: "500px",
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
              getRowId={(row) => row.id}
              rows={rows}
              columns={columns}
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
              onRowClick={handleRowClick}
              processRowUpdate={processRowUpdate}
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <LeafletMap
            id="map"
            // position={coords ? coords : null}
            markers={selectedPair.length !== 0 ? selectedPair : selectedMarkers}
            // nodes={props.nodes}
            // setNodes={props.setNodes}
            // abNodes={props.abNodes}
            // setAbNodes={props.setAbNodes}
            // bcaNodes={props.bcaNodes}
            // setBcaNodes={props.setBcaNodes}
            // abShapeNodes={props.abShapeNodes}
            // setAbShapeNodes={props.setAbShapeNodes}
            // bcaShapeNodes={props.bcaShapeNodes}
            // setBcaShapeNodes={props.setBcaShapeNodes}
            // showClickableMarkers
            showMarkers
            // zoom={18}
            bounds={props.bbox}
            height={"500px"}
          />
        </Grid>
      </Grid>

      <Box sx={{ flex: "1 1 auto" }} />

      <Box
        sx={{
          display: "flex-center",
          alignContent: "center",
          justifyContent: "center",
          justifyItems: "center",
          alignItems: "center",
          mb: 3,
          mt: 3,
        }}
      >
        <Typography variant="h6" mb={3}>
          Trip Roundtrip Duration: {Math.floor(roundtripDuration)} seconds
        </Typography>
      </Box>
    </>
  )
}
