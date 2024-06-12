import { useEffect, useState } from "react"
import axios from "axios"
import {
  Box,
  Card,
  CardContent,
  Fab,
  Typography,
  useTheme,
} from "@mui/material"
import { Header } from "../../components/Header"
import { exportGtfsData } from "../../services/ExportToGTFSFiles"
import { tokens } from "../../theme"
import DownloadIcon from "@mui/icons-material/Download"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../firebase-config"

export const Dashboard = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [healthStatus, setHealthStatus] = useState<string>("")
  const [gtfsMetrics, setGtfsMetrics] = useState({
    stops: 0,
    routes: 0,
    agencies: 0,
    calendars: 0,
    shapes: 0,
    stopTimes: 0,
    frequencies: 0,
    trips: 0,
  })

  // const [errors, setErrors] = useState<ErrorData[]>([])

  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    const fetchHealthStatus = async () => {
      try {
        const response = await axios.get(
          "https://otp.api.jratienza.org/otp/actuators/health"
        )
        if (response.status === 200) {
          setHealthStatus("UP")
        } else {
          setHealthStatus("DOWN")
        }
      } catch (error) {
        setHealthStatus("DOWN")
      }
    }

    const fetchMetrics = async () => {
      const fetchCollectionData = async (collectionName: string) => {
        const collectionRef = collection(db, collectionName)
        const snapshot = await getDocs(collectionRef)
        return snapshot.docs.length
      }

      const stopsCount = await fetchCollectionData("stops")
      const routesCount = await fetchCollectionData("routes")
      const agenciesCount = await fetchCollectionData("agency")
      const calendarsCount = await fetchCollectionData("calendar")
      const shapesCount = await fetchCollectionData("shapes")
      const stopTimesCount = await fetchCollectionData("stop_times")
      const frequenciesCount = await fetchCollectionData("frequencies")
      const tripsCount = await fetchCollectionData("trips")

      setGtfsMetrics({
        stops: stopsCount,
        routes: routesCount,
        agencies: agenciesCount,
        calendars: calendarsCount,
        shapes: shapesCount,
        stopTimes: stopTimesCount,
        frequencies: frequenciesCount,
        trips: tripsCount,
      })
    }
    // const fetchDataAndCheckErrors = async () => {
    //   const collections = ["stops", "routes", "agency", "calendar", "shapes", "stop_times", "frequencies", "trips"]
    //   const errorData: ErrorData[] = []

    //   for (const c of collections) {
    //     const collectionRef = collection(db, c)
    //     const snapshot = await getDocs(collectionRef)
    //     const data = snapshot.docs.map((doc) => doc.data())

    //     data.forEach((item, index) => {
    //       Object.entries(item).forEach(([key, value]) => {
    //         if (value === undefined || value === null || (typeof value === "string" && value.trim() === "")) {
    //           errorData.push({
    //             location: `${collection}:${index}`,
    //             error: `Value has excess whitespace: ${key} for ${c.slice(0, -1)}_name`,
    //           })
    //         }
    //       })
    //     })
    //   }

    //   setErrors(errorData)
    // }

    fetchHealthStatus()
    fetchMetrics()
    // fetchDataAndCheckErrors()
  }, [])

  return (
    <Box m={"20px"}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Header title="Dashboard" subtitle="Welcome to the dashboard" />
      </Box>
      <Box my={"20px"}>
        <Card
          sx={{
            backgroundColor: colors.primary[400],
            color: colors.grey[100],
            borderRadius: "12px",
            boxShadow: 3,
            mb: 2,
          }}
        >
          <CardContent>
            <Typography variant="h4" component="div" mb={2}>
              OTP Server Status
            </Typography>
            {healthStatus === "UP" ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Typography variant="h2" fontWeight={"bold"}>
                  Server is
                </Typography>
                <Typography
                  variant="h2"
                  fontWeight={"bold"}
                  color={colors.greenAccent[600]}
                  ml={1}
                >
                  {healthStatus}
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Typography variant="h2" fontWeight={"bold"}>
                  Server is
                </Typography>
                <Typography
                  variant="h2"
                  fontWeight={"bold"}
                  color={colors.redAccent[600]}
                  ml={1}
                >
                  {healthStatus}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
      <Box my={"20px"}>
        <Card
          sx={{
            backgroundColor: colors.primary[400],
            color: colors.grey[100],
            borderRadius: "12px",
            boxShadow: 3,
          }}
        >
          <CardContent>
            <Typography variant="h4" component="div">
              GTFS Metrics
            </Typography>
            <Typography variant="h5" component="div" mt={2}>
              Agencies: {gtfsMetrics.agencies}
            </Typography>
            <Typography variant="h5" component="div" mt={1}>
              Stops: {gtfsMetrics.stops}
            </Typography>
            <Typography variant="h5" component="div" mt={1}>
              Routes: {gtfsMetrics.routes}
            </Typography>
            <Typography variant="h5" component="div" mt={1}>
              Trips: {gtfsMetrics.trips}
            </Typography>
            <Typography variant="h5" component="div" mt={1}>
              Stop Times: {gtfsMetrics.stopTimes}
            </Typography>
            <Typography variant="h5" component="div" mt={1}>
              Shapes: {gtfsMetrics.shapes}
            </Typography>
            <Typography variant="h5" component="div" mt={1}>
              Frequencies: {gtfsMetrics.frequencies}
            </Typography>
            <Typography variant="h5" component="div" mt={1}>
              Calendars: {gtfsMetrics.calendars}
            </Typography>
          </CardContent>
        </Card>
        {/* <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Location</TableCell>
              <TableCell>Error</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {errors.map((error, index) => (
              <TableRow key={index}>
                <TableCell>{error.location}</TableCell>
                <TableCell>{error.error}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}
      </Box>
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          backgroundColor: colors.greenAccent[600],
          color: colors.grey[100],
          "&:hover": {
            backgroundColor: colors.greenAccent[800],
          },
        }}
        onClick={() => {
          setDownloading(true)
          exportGtfsData()
            .then(() => setDownloading(false))
            .catch(() => setDownloading(false))
        }}
        disabled={downloading}
      >
        <DownloadIcon />
      </Fab>
    </Box>
  )
}
