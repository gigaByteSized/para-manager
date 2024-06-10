import { Box } from "@mui/material"
import { useState, useEffect, useMemo } from "react"
import { LeafletMap } from "../../components/LeafletMap"
import useSessionStorage from "../../hooks/useSessionStorage"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../firebase-config"
import KmlGenerator from "../trips-manager/kmlGen"


export const StopsViewer = (props) => {
  const [rows, setRows] = useSessionStorage("viewRows", [])
  const [markers, setMarkers] = useState([])
  const stopsColRef = collection(db, "stops")

  useEffect(() => {
    fetchStops()
    fetchMarkersFromRows()
  }, [])
  
  useEffect(() => {
    setTimeout(() => {
    fetchStops()
    fetchMarkersFromRows()
    }, 10000)
  }, [rows])

  const fetchStops = async () => {
    const data = await getDocs(stopsColRef)
    setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))

    // return 1
    // setViewRows(rows)
  }

  const fetchMarkersFromRows = () => {
    const markers = rows.map((row) => {
      return {
        position: { lat: row.stop_lat, lng: row.stop_lon },
        tooltip: row.stop_name,
      }
    })
    setMarkers(markers)
  }

  // useMemo(() => {
  //   fetchMarkersFromRows()
  //   setCoords(
  //     rows.map((row) => {
  //       return [row.stop_lon, row.stop_lat]
  //     })
  //   )
  //   // checkForChanges()
  // }, [rows])

  return (
    <Box
      sx={{
        position: "fixed",
        padding: 0,
        margin: 0,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1000,
      }}
    >
      <KmlGenerator latlongArray={markers}/>
      <LeafletMap
        id="map"
        // callback={setFieldValue}
        // showDraggableMarker
        // showMarkers
        showPolyline
        // markers={markers}
        iconSize={[20, 20]}
        zoom={18}
        height={"100%"}
      />
      {/* {coords.map((coord, index) => {
        return (
          <Box key={index}>
            [{coord[0]}, {coord[1]}], 
          </Box>
        )
      })} */}
    </Box>
  )
}
