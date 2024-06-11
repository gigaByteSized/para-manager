import Box from "@mui/material/Box"
import Stepper from "@mui/material/Stepper"
import Step from "@mui/material/Step"
import StepLabel from "@mui/material/StepLabel"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { useTheme } from "@mui/material/styles"
import { tokens } from "../../../theme"
import { LeafletMap } from "../../../components/LeafletMap"
import { Formik, Form } from "formik"
import * as schemas from "../../../schemas"
import { getCurrentPosition } from "../../../services/GetCurrentPosition"
import { GeneralTripInfo } from "./GeneralTripInfo"
import { useNavigate } from "react-router-dom"
import React, { useEffect, useState } from "react"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where
} from "firebase/firestore"
import { db } from "../../../firebase-config"
import { ShapeBuilder } from "./ShapeBuilder"
import { getDirections } from "../../../api/ors_api"
import { ReviewTrip } from "./ReviewTrip"
import Swal from "sweetalert2"
import dayjs from "dayjs"
import {
  Backdrop,
  CircularProgress,
  CircularProgressProps,
} from "@mui/material"
import { StopTimes } from "./StopTimes"
import polyUtil from "polyline-encoded"

const CircularProgressWithLabel = (
  props: CircularProgressProps & { value: number }
) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.primary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  )
}

const stepLabels = [
  "General route information",
  "Route plotter",
  "Stop times",
  "Review and save route",
]

export const TripWizard = (props) => {
  const [orsRes, setOrsRes] = useState(null)
  const [legDurations, setLegDurations] = useState([])
  const [error, setError] = useState(null)

  const [open, setOpen] = useState(false)
  const handleClose = () => {
    setOpen(false)
  }
  const handleOpen = () => {
    setOpen(true)
  }
  const [progressVal, setProgressVal] = useState(0)



  const fetchDirections = async (coordinates: any[], callback) => {
    try {
      const result = await getDirections(coordinates)
      console.log(result)
      callback(result)
    } catch (error) {
      setError("Failed to fetch directions")
    }
  }

  const [rows, setRows] = useState([])
  const [loaded, setLoaded] = useState(false)

  const [markers, setMarkers] = useState([])
  const stopsColRef = collection(db, "stops")

  const [routeValue, setRouteValue] = useState(null)

  const [calendarValue, setCalendarValue] = useState(null)

  const [mode, setMode] = useState("a")

  const [nodes, setNodes] = useState([])
  const [abNodes, setAbNodes] = useState([])
  const [bcaNodes, setBcaNodes] = useState([])

  const [abShapeNodes, setAbShapeNodes] = useState([])
  const [bcaShapeNodes, setBcaShapeNodes] = useState([])

  // const [shapePtCount, setShapePtCount] = useState(0)
  const [shapePts, setShapePts] = useState([])

  const tripsColRef = collection(db, "trips")
  const frequenciesColRef = collection(db, "frequencies")
  const stop_timesColRef = collection(db, "stop_times")
  const shapesColRef = collection(db, "shapes")

  useEffect(() => {
    fetchStops()
  }, [loaded])

  useEffect(() => {
    // console.log(shapePts)
    console.log(nodes)
  }, [nodes])

  useEffect(() => {
    if(orsRes !== null) {
      setShapePts(polyUtil.decode(orsRes.routes[0].geometry))
    }
  }, [orsRes])

  // useEffect(() => {
  //   console.log(legDurations)
  // }, [legDurations])

  // useEffect(() => {
  //   setProgressVal(legDurations.length / nodes.length * 100)
  // }, [legDurations])

  const fetchStops = async () => {
    const data = await getDocs(stopsColRef)
    setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))

    fetchMarkersFromRows()
    setLoaded(true)
  }

  const fetchMarkersFromRows = async () => {
    const markers = rows.map((row) => {
      return {
        stop_id: row.stop_id,
        position: { lat: row.stop_lat, lng: row.stop_lon },
        tooltip: row.stop_name,
      }
    })
    setMarkers(markers)
  }

  const navigate = useNavigate()
  const initialValues = {
    route_id: "",
    service_id: "",
    trip_id: "",
    start_time: dayjs(new Date())
      .set("second", 0)
      .tz("Asia/Manila")
      .format("HH:mm:ss"),
    end_time: dayjs(new Date())
      .set("second", 0)
      .tz("Asia/Manila")
      .format("HH:mm:ss"),
  }
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const [activeStep, setActiveStep] = useState(0)
  const [skipped, setSkipped] = useState(new Set<number>())

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.")
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values())
      newSkipped.add(activeStep)
      return newSkipped
    })
  }

  const isStepOptional = (step: number) => {
    const optionalSteps = [] // Add optional steps here
    return optionalSteps.includes(step)
  }

  const isStepSkipped = (step: number) => {
    return skipped.has(step)
  }

  const isLastStep = () => {
    return activeStep === stepLabels.length - 1
  }

  const checkArrayEndStartMatch = (array1, array2) => {
    if (array1.length === 0 || array2.length === 0) {
      return false
    }

    const lastElementOfArray1 = array1[array1.length - 1]
    const firstElementOfArray2 = array2[0]

    // Check if the elements are the same
    return (
      JSON.stringify(lastElementOfArray1) ===
      JSON.stringify(firstElementOfArray2)
    )
  }

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`
  }

  const onSubmit = async (values: any, formikBag: { setSubmitting: any }) => {
    const { setSubmitting } = formikBag

    if (!isLastStep()) {
      setSubmitting(false)

      if (activeStep === 1) {
        setProgressVal(0)
        handleOpen()
        setSubmitting(true)
        var errs = []
        if (abNodes.length === 0) {
          errs.push("Leg A stops")
        }
        if (bcaNodes.length === 0) {
          errs.push("Leg B stops")
        }
        if (abShapeNodes.length === 0) {
          errs.push("Leg A shape")
        }
        if (bcaShapeNodes.length === 0) {
          errs.push("Leg B shape")
        }

        if (errs.length > 0) {
          Swal.fire(
            "Error",
            `<p>The following fields must not be empty:<p></br>
            ${errs.join(", ")}`,
            "error"
          )
          return
        }

        // if (abNodes.length === 0 || bcaNodes.length === 0) {
        //   Swal.fire("Error", "Stops for legs A and B must not be empty", "error")
        //   return
        // }

        // if (abShapeNodes.length === 0 || bcaShapeNodes.length === 0) {
        //   Swal.fire("Error", "Shapes egs A and B must not be empty", "error")
        //   return
        // }

        if (!checkArrayEndStartMatch(abNodes, bcaNodes)) {
          const nodeConcat = abNodes.concat(bcaNodes)
          setNodes(nodeConcat)
        }

        if (!checkArrayEndStartMatch(abShapeNodes, bcaShapeNodes)) {
          if (abShapeNodes.length + bcaShapeNodes.length <= 70) {
            const nodeShapeConcat = abShapeNodes.concat(bcaShapeNodes)
            await fetchDirections(nodeShapeConcat, setOrsRes)

            // update progress bar
            // setProgressVal(33)
          } else {
            Swal.fire(
              "Error",
              "Total number of stops for trip shape must not exceed 70",
              "error"
            )
          }
        } else {
          Swal.fire(
            "Error",
            "Stop at the end of Leg A must not be the same as the stop at the start of Leg B",
            "error"
          )
          return
        }
        // await fetchDirections(nodes)
        setSubmitting(false)
      }

      // setTimeout(() => {
      //   setSubmitting(false)
      // }, 1000)

      handleClose()
      handleNext()
      return
    }

    console.log(values)
    // TODO : Send data to server

    // setTimeout(() => {
    //   setSubmitting(false)
    // }, 1000)
    try {
      // const docQueryRef = doc(db, "stops", values.stop_name)
      // const docSnap = await getDoc(docQueryRef)
      // if (docSnap.exists()) {
      //   Swal.fire("Error", "Stop name already in database", "error")
      //   throw new Error("Stop node already in database")
      // }

      // await addDoc(shapesColRef!, {
      //   shape_id: values.trip_id,
      //   stop_name: values.stop_name,
      //   stop_lat: values.stop_lat,
      //   stop_lon: values.stop_lon,
      //   stop_desc: values.stop_desc,
      // })

      // add shapes to shapes collection
      shapePts.forEach(async (shapePt, index) => {
        await addDoc(shapesColRef!, {
          shape_id: values.trip_id,
          shape_pt_lat: shapePt[0],
          shape_pt_lon: shapePt[1],
          shape_pt_sequence: index + 1,
        })
      })

      // add stop_times entry
      const interval = orsRes.routes[0].summary.duration / nodes.length
      let cumulativeTime = 0

      // Add logic to prevent 40 requests per minute limit
      setProgressVal(0)
      handleOpen()
      nodes.forEach(async (node, index) => {
        var timeString = formatTime(cumulativeTime)
        // if (index > 0) {
        //   // await fetchDirections([nodes[index - 1][1], node[1]], setTempOrsRes)

        //   // // Wait for tempOrsRes to be updated
        //   // while (tempOrsRes === null) {
        //   //   await new Promise((resolve) => setTimeout(resolve, 50))
        //   // }

        //   // const interval = tempOrsRes.routes[0].summary.duration
        //   // cumulativeTime += interval
        //   // timeString = formatTime(cumulativeTime)

        //   // setProgressVal(((index + 1) / nodes.length) * 100)
        //   // setTempOrsRes(null)

        //   // // Optionally add a delay here if necessary
        //   // await new Promise((resolve) => setTimeout(resolve, 2000))
        //   const interval = legDurations[index - 1]
        //   console.log(interval)
        //   cumulativeTime += interval
        //   timeString = formatTime(cumulativeTime)

        // }

        if (index > 0) {
          const interval = legDurations[index - 1]
          console.log(interval)
          cumulativeTime += interval
          timeString = formatTime(cumulativeTime)
        }

        await addDoc(stop_timesColRef!, {
          trip_id: values.trip_id,
          arrival_time: timeString!,
          departure_time: timeString,
          stop_id: node[0],
          stop_sequence: index + 1,
        })
        cumulativeTime += interval
      })

      setProgressVal(33)

      // add frequency entry
      await addDoc(frequenciesColRef!, {
        trip_id: values.trip_id,
        start_time: values.start_time,
        end_time: values.end_time,
        headway_secs: 600,
      })

      setProgressVal(66)

      // add trip entry
      await addDoc(tripsColRef!, {
        route_id: values.route_id,
        service_id: values.service_id,
        trip_id: values.trip_id,
        shape_id: values.trip_id,
      })

      setProgressVal(100)

      handleClose()
      // return // TODO:
      // props.callback()
      // props.close()

      Swal.fire({
        title: "Added!",
        text: `Stop ID , "${values}" has been added.`,
        icon: "success",
        confirmButtonColor: colors.greenAccent[600],
        cancelButtonColor: colors.redAccent[500],
        background: theme.palette.background.default,
        color: colors.grey[100],
        timer: 1500,
      })
    } catch (e) {
      handleClose()
      console.error("Error adding document: ", e)
      navigate("/trips")
      // props.close()
    }

    // go back to route grid
    navigate("/trips")
  }

  const handleNext = () => {
    let newSkipped = skipped
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped(newSkipped)
  }

  const handleBack = () => {
    if (activeStep === 0) {
      navigate("/trips")
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }



  return (
    <>
      <Backdrop
        sx={{ color: colors.blueAccent[500], zIndex: 99999 }}
        open={open}
      >
        {/* <CircularProgressWithLabel value={progressVal} color="inherit" /> */}
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        sx={{
          display: "flex",
          p: 0.5,
          pb: 1,
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            width: "100%",
          }}
        >
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={schemas.tripSchema}
          >
            {({ isSubmitting, touched, values, setFieldValue }) => (
              <>
                <Form>
                  <Stepper activeStep={activeStep}>
                    {stepLabels.map((label, index) => {
                      const stepProps: { completed?: boolean } = {}
                      const labelProps: {
                        optional?: any
                      } = {}

                      // if (isStepOptional(index)) {
                      //   labelProps.optional = (
                      //     <Typography variant="caption">Optional</Typography>
                      //   )
                      // }

                      if (isStepSkipped(index)) {
                        stepProps.completed = false
                      }
                      return (
                        <Step
                          key={label}
                          {...stepProps}
                          sx={{
                            "& .css-oxf95d-MuiSvgIcon-root-MuiStepIcon-root.Mui-active":
                              {
                                color: colors.greenAccent[600],
                              },
                            "& .css-oxf95d-MuiSvgIcon-root-MuiStepIcon-root.Mui-completed":
                              {
                                color: colors.blueAccent[300],
                              },
                            "& .Mui-active": {
                              color: colors.greenAccent[600],
                            },
                          }}
                        >
                          <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                      )
                    })}
                  </Stepper>
                  {activeStep === stepLabels.length ? (
                    <>
                      <Typography sx={{ mt: 2, mb: 1 }}>
                        All steps completed - you&apos;re finished
                      </Typography>
                      <Box
                        sx={{ display: "flex", flexDirection: "row", pt: 2 }}
                      >
                        <Box sx={{ flex: "1 1 auto" }} />
                        <Button
                          onClick={handleReset}
                          sx={{
                            color: colors.grey[100],
                          }}
                        >
                          Reset
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box
                        sx={{
                          mt: 3,
                          mb: 3,
                        }}
                      >
                        {activeStep === 0 && (
                          <GeneralTripInfo
                            callback={setFieldValue}
                            values={values}
                            routeValue={routeValue}
                            setRouteValue={setRouteValue}
                            calendarValue={calendarValue}
                            setCalendarValue={setCalendarValue}
                          />
                        )}
                        {activeStep === 1 && (
                          <ShapeBuilder
                            callback={setFieldValue}
                            values={values}
                            markers={markers}
                            mode={mode}
                            setMode={setMode}
                            nodes={nodes}
                            setNodes={setNodes}
                            abNodes={abNodes}
                            setAbNodes={setAbNodes}
                            bcaNodes={bcaNodes}
                            setBcaNodes={setBcaNodes}
                            abShapeNodes={abShapeNodes}
                            setAbShapeNodes={setAbShapeNodes}
                            bcaShapeNodes={bcaShapeNodes}
                            setBcaShapeNodes={setBcaShapeNodes}
                          />
                        )}
                        {activeStep === 2 && (
                          <StopTimes
                            orsRes={orsRes}
                            numNodes={nodes.length}
                            callback={setFieldValue}
                            values={values}
                            markers={markers}
                            mode={mode}
                            setMode={setMode}
                            nodes={nodes}
                            setNodes={setNodes}
                            abNodes={abNodes}
                            setAbNodes={setAbNodes}
                            bcaNodes={bcaNodes}
                            setBcaNodes={setBcaNodes}
                            abShapeNodes={abShapeNodes}
                            setAbShapeNodes={setAbShapeNodes}
                            bcaShapeNodes={bcaShapeNodes}
                            setBcaShapeNodes={setBcaShapeNodes}
                            onUpdateDurations={setLegDurations}
                            bounds={orsRes.bbox}
                          />
                        )}

                        {activeStep === 3 && (
                          <>
                            <Typography>Review and save route</Typography>
                            <Box>
                              <ReviewTrip
                                values={values}
                                orsRes={orsRes}
                                error={error}
                                shapePts={shapePts}
                                setShapePts={setShapePts}
                                bounds={orsRes.bbox}
                              />
                            </Box>
                          </>
                        )}
                      </Box>

                      <Box
                        sx={{ display: "flex", flexDirection: "row", pt: 2 }}
                      >
                        <Button
                          variant="contained"
                          // disabled={activeStep === 0}
                          onClick={handleBack}
                          sx={{
                            mr: 2,
                            color: colors.grey[100],
                            backgroundColor: colors.redAccent[600],
                            "&:hover": {
                              backgroundColor: colors.redAccent[700],
                            },
                          }}
                        >
                          {activeStep === 0 ? "Cancel" : "Back"}
                        </Button>
                        <Box sx={{ flex: "1 1 auto" }} />
                        {/* {isStepOptional(activeStep) && (
                        <Button
                          color="inherit"
                          onClick={handleSkip}
                          sx={{ mr: 1 }}
                        >
                          Skip
                        </Button>
                      )} */}
                        <Button
                          variant="contained"
                          disabled={isSubmitting}
                          type="submit"
                          sx={{
                            backgroundColor: colors.greenAccent[600],
                            color: colors.grey[100],
                            "&:hover": {
                              backgroundColor: colors.greenAccent[800],
                            },
                          }}
                        >
                          {isLastStep() ? "Submit" : "Next"}
                        </Button>
                      </Box>
                    </>
                  )}
                </Form>
                {/* <pre>{JSON.stringify(values, null, 2)}</pre>
                <pre>{JSON.stringify(touched, null, 2)}</pre> */}
              </>
            )}
          </Formik>
        </Box>
      </Box>
    </>
  )
}
