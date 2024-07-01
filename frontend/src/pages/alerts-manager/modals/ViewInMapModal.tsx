import {
  Modal,
  Backdrop,
  Fade,
  Box,
  Typography,
  Grid,
  useTheme,
} from "@mui/material"
import { LeafletMap } from "../../../components/LeafletMap"
import { useEffect, useState } from "react"
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore"
import { db } from "../../../firebase-config"
import polyUtil from "polyline-encoded"
import { DataGrid } from "@mui/x-data-grid"
import { latLng } from "leaflet"

export const ViewInMapModal = (props) => {
  const theme = useTheme()
  const alertsColRef = collection(db, "_meta-community-alerts")

  const [alertData, setAlertData] = useState<any>({})
  const [marker, setMarker] = useState<any>(latLng(14.5995, 120.9842))

  useEffect(() => {
    const fetchAlertData = async () => {
      const alertDoc = await getDoc(doc(alertsColRef, props.alertId))
      setAlertData(alertDoc.data())
    }

    fetchAlertData()
  }, [props.alertId])

  // marker from coordinates
  useEffect(() => {
    setMarker(latLng(alertData.stop_lat, alertData.stop_lon))
    console.log(marker)
  }, [alertData])

  // const markers = [temp]

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
            Alert Location
          </Typography>

          {/* <LeafletMap id="map" markers={markers} showMarkers height="400px" /> */}
        </Box>
      </Fade>
    </Modal>
  )
}
