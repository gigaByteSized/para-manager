import {
  Modal,
  Backdrop,
  Fade,
  Box,
  Typography,
  Grid,
  useTheme,
} from "@mui/material"
import { LeafletMap } from "../../components/LeafletMap"
import { useEffect, useState } from "react"
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore"
import { db } from "../../firebase-config"
import polyUtil from "polyline-encoded"
import { DataGrid } from "@mui/x-data-grid"

export const TripDetailsModal = (props) => {
  const theme = useTheme()
  const [tripData, setTripData] = useState(null)
  const [frequencyData, setFrequencyData] = useState(null)
  const [stopTimesData, setStopTimesData] = useState(null)
  const [shapeData, setShapeData] = useState(null)

  useEffect(() => {
    fetchTripData()
  }, [props.tripId])

  const fetchTripData = async () => {
    if (props.tripId) {
      const tripDocRef = doc(db, "trips", props.tripId)
      const tripSnapshot = await getDoc(tripDocRef)

      if (tripSnapshot.exists()) {
        const tripData = tripSnapshot.data()
        setTripData(tripData)

        const frequencyColRef = collection(db, "frequencies")
        const frequencyQuery = query(
          frequencyColRef,
          where("trip_id", "==", tripData.trip_id)
        )
        const frequenciesSnapshot = await getDocs(frequencyQuery)
        setFrequencyData(
          frequenciesSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        )

        const stopTimesColRef = collection(db, "stop_times")
        const stopTimesQuery = query(
          stopTimesColRef,
          where("trip_id", "==", tripData.trip_id)
        )
        const stopTimesSnapshot = await getDocs(stopTimesQuery)
        setStopTimesData(
          stopTimesSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        )

        const shapesColRef = collection(db, "shapes")
        const shapesQuery = query(
          shapesColRef,
          where("shape_id", "==", tripData.shape_id)
        )
        const shapesSnapshot = await getDocs(shapesQuery)
        setShapeData(
          shapesSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        )
      }
    }
  }

  const getEncodedPolyline = () => {
    if (shapeData) {
      var sortedShapeData = shapeData.sort(
        (a, b) => a.shape_pt_sequence - b.shape_pt_sequence
      )
      if (sortedShapeData) {
        const latLngs = sortedShapeData.map((shape) => [
          shape.shape_pt_lat,
          shape.shape_pt_lon,
        ])
        return polyUtil.encode(latLngs)
      }
    }

    // if (shapeData) {
    //   const latLngs = shapeData.map((shape) => [shape.shape_pt_lat, shape.shape_pt_lon])
    //   return polyUtil.encode(latLngs)
    // }
    return ""
  }

  const stopTimesColumns = [
    { field: "stop_id", headerName: "Stop ID", flex: 1 },
    { field: "arrival_time", headerName: "Arrival Time", flex: 1 },
    { field: "departure_time", headerName: "Departure Time", flex: 1},
  ]

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={props.open}
      onClose={props.close}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
      sx={{ overflowY: "scroll" }}
    >
      <Fade in={props.open}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "60vw",
            bgcolor: theme.palette.background.default,
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" mb={3}>
            Trip Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} mb={2}>
              <LeafletMap
                id="map"
                showPolyline
                encodedPolyline={getEncodedPolyline()}
                height="400px"
              />
            </Grid>
            <Grid item xs={6}>
              <Grid item xs={12}>
                <Typography variant="h5">Trip Details</Typography>
                {tripData && (
                  <ul>
                    <li>Route ID: {tripData.route_id}</li>
                    <li>Service ID: {tripData.service_id}</li>
                    <li>Trip ID: {tripData.trip_id}</li>
                  </ul>
                )}
              </Grid>
              <Grid item xs={12} mt={8}>
                <Typography variant="h5">Frequency Details</Typography>
                {frequencyData && (
                  <ul>
                    <li>Start Time: {frequencyData[0].start_time}</li>
                    <li>End Time: {frequencyData[0].end_time}</li>
                    <li>Headway: {frequencyData[0].headway_secs} seconds</li>
                  </ul>
                )}
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5">Stop Times</Typography>
              {stopTimesData ? (
                <div style={{ height: 250, width: "100%" }}>
                  <DataGrid
                    rows={stopTimesData}
                    columns={stopTimesColumns}
                    getRowId={(row) => row.stop_id}
                  />
                </div>
              ) : (
                <Typography variant="body1">No stop times found</Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Modal>
  )
}
