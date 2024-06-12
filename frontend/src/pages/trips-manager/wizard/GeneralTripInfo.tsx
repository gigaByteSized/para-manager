import Typography from "@mui/material/Typography"
import { Autocomplete, Box, Grid, TextField, useTheme } from "@mui/material"
import { CustomTextField } from "../../../components/forms/CustomTextField"
import { CustomSelect } from "../../../components/forms/CustomSelect"
import { LocalizeRouteTypes } from "../../../services/LocalizeRouteTypes"
import { ItemizeRouteTypes } from "../../../services/ItemizeRouteTypes"
import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../../firebase-config"
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"
import { tokens } from "../../../theme"



export const GeneralTripInfo = (props) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const [routes, setRoutes] = useState([])
  const [routeID, setRouteID] = useState("")
  const [routeRows, setRouteRows] = useState([])

  const [calendar, setCalendar] = useState([])
  const [calendarString, setCalendarString] = useState("")
  const [calendarRows, setCalendarRows] = useState([])

  const [loaded, setLoaded] = useState(false)

  const routesColRef = collection(db, "routes")
  const calendarColRef = collection(db, "calendar")

  // const [routeValue, setRouteValue] = useState(null)
  const [routeInputValue, setRouteInputValue] = useState("")

  // const [calendarValue, setCalendarValue] = useState(null)
  const [calendarInputValue, setCalendarInputValue] = useState("")
  const [startTime, setStartTime] = useState(dayjs().set('hour', 4).set('minute', 0).set('second', 0))
  const [endTime, setEndTime] = useState(dayjs().set('hour', 22).set('minute', 0).set('second', 0))

  useEffect(() => {
    fetchRoutes()
    console.log(props.values)
  }, [loaded])

  const fetchRoutes = async () => {
    const routeData = await getDocs(routesColRef)
    setRouteRows(routeData.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    buildRouteIDs()

    const calendarData = await getDocs(calendarColRef)
    setCalendarRows(
      calendarData.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    )
    buildServiceIds()

    setLoaded(true)
  }

  const buildRouteIDs = () => {
    const routeNames = routeRows.map((row) => {
      return {
        id: row.route_id,
        name: row.route_short_name ? row.route_short_name : row.route_long_name,
      }
    })
    setRoutes(routeNames)
  }

  const buildServiceIds = () => {
    const serviceNames = calendarRows.map((row) => {
      return {
        id: row.service_id,
      }
    })
    setCalendar(serviceNames)
  }

  const dateTimePickerSx = {
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
  }

  return (
    <>
      <Typography variant="h4" mb={3}>
        Trip Information
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={4}>
          <Grid item xs={12}>
            {/* <CustomTextField
              id="route_long_name"
              name="route_long_name"
              label="Route long name"
            /> */}
            <Autocomplete
              value={props.routeValue}
              onChange={(e, newValue) => {
                props.setRouteValue(newValue)
                routeRows.map((row) => {
                  var parseVal = newValue.split("] ")[1]
                  if (row.route_short_name ? row.route_short_name === parseVal : row.route_long_name === parseVal) {
                    console.log(row.route_id)
                    setRouteID(
                      row.route_id
                    )
                    props.callback("route_id", row.route_id)
                    return
                  }
                })
              }}
              inputValue={routeInputValue}
              onInputChange={(e, newInputValue) => {
                setRouteInputValue(newInputValue)
              }}
              options={routes.map((option) => `[${option.id}] ${option.name}`).sort()}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  fullWidth
                  id="route_id"
                  name="route_id"
                  label="Route ID"
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              value={props.calendarValue}
              onChange={(e, newValue) => {
                props.setCalendarValue(newValue)
                calendarRows.map((row) => {
                  if (row.service_id === newValue) {
                    const str = `${row.start_date} - ${row.end_date} | ${
                      row.monday ? "M " : ""
                    }${row.tuesday ? "T " : ""}${row.wednesday ? "W " : ""}${
                      row.thursday ? "Th " : ""
                    }${row.friday ? "F " : ""}${row.saturday ? "Sat " : ""}${
                      row.sunday ? "Sun " : ""
                    }`
                    setCalendarString(str)
                    return
                  }
                })
                props.callback("service_id", newValue)
              }}
              inputValue={calendarInputValue}
              onInputChange={(e, newInputValue) => {
                setCalendarInputValue(newInputValue)
              }}
              options={calendar.map((option) => `${option.id}`).sort()}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  fullWidth
                  id="service_id"
                  name="service_id"
                  label="Service ID"
                />
              )}
            />
            {/* <CustomTextField
              fullWidth
              id="route_short_name"
              name="route_short_name"
              label="Route short name"
            /> */}
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              id="trip_id"
              name="trip_id"
              label="Trip ID"
            />
          </Grid>
        </Grid>
        <Grid item xs={8}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Route ID"
              value={routeID}
              disabled
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Service schedule"
              value={calendarString}
              disabled
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Trip ID convention"
              value={"PROVINCE_headsignFrom_headsignTo        OR         PROVINCE_headsignFrom_headsignTo_variationNumber"}
              disabled
              sx={{ mb: 2 }}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              alignContent: "center",
              justifyContent: "space-between",
              alignItems: "center",
              mx: 15,
              mb: 3,
              // mt: 1,
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* <DatePicker
                              label="Start Date"
                              value={startDate}
                              onChange={(newValue) => {
                                setStartDate(newValue)
                                setFieldValue(
                                  "start_date",
                                  newValue
                                    .tz("Asia/Manila")
                                    .format("YYYY-MM-DD")
                                )
                              }}
                              sx={dateTimePickerSx}
                            /> */}
              <TimePicker
                label="Standard service start time"
                value={startTime}
                onChange={(newValue) => {
                  const modifiedValue = newValue.set('second', 0);
                  props.callback(
                    "start_time",
                    modifiedValue.tz("Asia/Manila").format("HH:mm:ss")
                  );
                }}
                sx={dateTimePickerSx}
              />

              <Typography variant="h5"> {"to"}</Typography>
              <TimePicker
                label="Standard service end time"
                value={endTime}
                onChange={(newValue) => {
                  const modifiedValue = newValue.set('second', 0)
                  setEndTime(modifiedValue)
                  props.callback(
                  "end_time",
                  modifiedValue.tz("Asia/Manila").format("HH:mm:ss")
                  )
                }}
                sx={dateTimePickerSx}
              />
              {/* <DatePicker
                              label="End Date"
                              value={endDate}
                              sx={dateTimePickerSx}
                              onChange={(newValue) => {
                                setEndDate(newValue)
                                setFieldValue(
                                  "end_date",
                                  newValue
                                    .tz("Asia/Manila")
                                    .format("YYYY-MM-DD")
                                )
                              }}
                            /> */}
            </LocalizationProvider>
          </Box>
        </Grid>

        {/* <Grid item xs={12}>
  
              </Grid> */}
      </Grid>
    </>
  )
}
