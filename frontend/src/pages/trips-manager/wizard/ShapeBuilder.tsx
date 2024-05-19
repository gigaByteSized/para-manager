import Typography from "@mui/material/Typography"
import {
  Box,
  Button,
  ButtonGroup,
  useTheme,
} from "@mui/material"
import { LeafletMap } from "../../../components/LeafletMap"
import { useEffect } from "react"
import { getCurrentPosition } from "../../../services/GetCurrentPosition"
import { tokens } from "../../../theme"

export const ShapeBuilder = (props) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const coords = getCurrentPosition()

  // useEffect(() => {
  //   console.log(props.abNodes)
  //   console.log(props.bcaNodes)
  // }, [props.abNodes, props.bcaNodes])

  const btnUnselectedConfigs = {
    sx: {
      height: 50,
      flexGrow: 1,
      backgroundColor: colors.blueAccent[800],
      color: colors.grey[400],
      "&:hover": {
        color: colors.grey[300],
        backgroundColor: colors.blueAccent[700],
      },
    },
  }

  const btnSelectedConfigs = {
    sx: {
      ...btnUnselectedConfigs.sx,
      backgroundColor: colors.blueAccent[600],
      color: colors.grey[100],
      "&:hover": {
        backgroundColor: colors.blueAccent[700],
      },
    },
  }

  return (
    <>
      <Typography variant="h4" mb={3}>
        Trip Plotter
      </Typography>
      <LeafletMap
        id="map"
        position={coords ? coords : null}
        markers={props.markers}
        mode={props.mode}
        nodes={props.nodes}
        setNodes={props.setNodes}
        abNodes={props.abNodes}
        setAbNodes={props.setAbNodes}
        bcaNodes={props.bcaNodes}
        setBcaNodes={props.setBcaNodes}
        abShapeNodes={props.abShapeNodes}
        setAbShapeNodes={props.setAbShapeNodes}
        bcaShapeNodes={props.bcaShapeNodes}
        setBcaShapeNodes={props.setBcaShapeNodes}
        // showClickableMarkers
        zoom={18}
        height={"500px"}
      />

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
        <ButtonGroup
          variant="contained"
          sx={{
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            onClick={() => {
              if (props.mode!== "a") {
                props.setMode("a")
              }
            }}
            sx={props.mode=== "a" ? btnSelectedConfigs.sx : btnUnselectedConfigs.sx}
          >
            Leg A Stops
          </Button>
          <Button
            onClick={() => {
              if (props.mode!== "b") {
                props.setMode("b")
              }
            }}
            sx={props.mode=== "b" ? btnSelectedConfigs.sx : btnUnselectedConfigs.sx}
          >
            Leg B Stops
          </Button>
          <Button
            onClick={() => {
              if (props.mode!== "c") {
                props.setMode("c")
              }
            }}
            sx={props.mode=== "c" ? btnSelectedConfigs.sx : btnUnselectedConfigs.sx}
          >
            Leg A Shape
          </Button>
          <Button
            onClick={() => {
              if (props.mode!== "d") {
                props.setMode("d")
              }
            }}
            sx={props.mode=== "d" ? btnSelectedConfigs.sx : btnUnselectedConfigs.sx}
          >
            Leg B Shape
          </Button>
        </ButtonGroup>
      </Box>
    </>
  )
}
