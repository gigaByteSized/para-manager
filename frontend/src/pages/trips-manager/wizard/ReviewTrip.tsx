import Typography from "@mui/material/Typography"
import { Box, Grid, TextField, useTheme } from "@mui/material"
import { LeafletMap } from "../../../components/LeafletMap"
import { tokens } from "../../../theme"
import { useState, useEffect} from "react"
import { LatLngExpression } from "leaflet"
import polyUtil from "polyline-encoded"


const ReviewTextField = (props) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  return (
    <TextField
      fullWidth
      value={props.value}
      label={props.label}
      InputProps={{
        readOnly: true,
      }}
      sx={{
        mb: 2,
        "& label.Mui-focused": {
          color: colors.greenAccent[400],
        },
        "& .MuiInput-underline:after": {
          borderBottomColor: colors.greenAccent[400],
        },
        "& .MuiInputLabel-root": {
          color: colors.grey[100],
        },
        "& .MuiOutlinedInput-input": {
          color: colors.grey[100],
        },
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: colors.primary[300],
          },
          "&:hover fieldset": {
            borderColor: colors.greenAccent[300],
          },
          "&.Mui-focused fieldset": {
            borderColor: colors.greenAccent[400],
          },
        },
      }}
    />
  )
}

export const ReviewTrip = (props) => {
  const [orsRes, setOrsRes] = useState<any>(props.orsRes)
  // const [bbox, setBbox] = useState<any>([])
  const [routes, setRoutes] = useState<any>([])
  const [segments, setSegments] = useState<any>([])

  const [encodedPolyline, setEncodedPolyline] = useState("")
  
  useEffect(() => {
    // setOrsRes(props.orsRes)

    // setBbox(orsRes.bbox)
    setRoutes(orsRes.routes)
    setSegments(orsRes.routes[0].segments)
    setEncodedPolyline(orsRes.routes[0].geometry)
    props.setShapePts(polyUtil.decode(orsRes.routes[0].geometry))
  }, [orsRes, routes, segments, encodedPolyline])

  return (
    <>
      <Typography variant="h4" mb={3}>
        Trip Information
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={4}>
          <Grid item xs={12}>
            <ReviewTextField
              fullWidth
              value={props.values.route_id}
              label="Route ID"
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <ReviewTextField
              fullWidth
              value={props.values.service_id}
              label="Service ID"
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <ReviewTextField
              fullWidth
              value={props.values.trip_id}
              label="Trip ID"
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
        <Grid item xs={8}>
          <LeafletMap
            id="map"
            // position={props.coords}
            // markers={selectedMarkers}
            // showMarkers
            showPolyline={encodedPolyline ? true : false}
            encodedPolyline={encodedPolyline ? encodedPolyline : ""}
            // bounds={props.bounds}
            // zoom={12}
            height={"500px"}
          />
        </Grid>
      </Grid>
    </>
  )
}
