import {
  Modal,
  Backdrop,
  Fade,
  Box,
  Typography,
  Grid,
  Button,
  useTheme,
} from "@mui/material"
import CustomTextField from "../../../components/forms/CustomTextField"
import { Formik, Form } from "formik"
import * as schemas from "../../../schemas"
import { tokens } from "../../../theme"
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore"
import { db } from "../../../firebase-config"
import Swal from "sweetalert2"
import { useEffect, useState } from "react"
import { LeafletMap } from "../../../components/LeafletMap"
import { CustomSelect } from "../../../components/forms/CustomSelect"
import { itemizeAgencies } from "../../../services/itemizeAgencies"
import useSessionStorage from "../../../hooks/useSessionStorage"

export const AddModal = (props) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [metaRows, setMetaRows] = useState([])
  const stopsColRef = collection(db, "stops")
  const metaColRef = collection(db, "_meta-stops-per-agency")

  const [stops, setStops] = useState([])

  const [markers, setMarkers] = useState([])

  const [initialPosition, setInitialPosition] = useSessionStorage(
    "session-LatLng",
    { lat: 14.5995, lng: 120.9842 }
  )
  const [showInactiveMarkers, setShowInactiveMarkers] = useState(false)

  const [agencyRows, setAgencyRows] = useState([])
  const agencyColRef = collection(db, "agency")

  useEffect(() => {
    fetchAgencies()
    fetchStopsPerAgency()
  }, [])

  useEffect(() => {
    fetchStops()
  }, [markers])

  const fetchStops = async () => {
    const data = await getDocs(stopsColRef)
    setStops(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    fetchMarkersFromRows()
  }

  const fetchAgencies = async () => {
    const data = await getDocs(agencyColRef)
    setAgencyRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  }

  const fetchStopsPerAgency = async () => {
    const data = await getDocs(metaColRef)
    setMetaRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  }

  const fetchMarkersFromRows = () => {
    const markers = stops.map((row) => {
      return {
        position: { lat: row.stop_lat, lng: row.stop_lon },
        tooltip: row.stop_name,
      }
    })
    setMarkers(markers)
  }

  // const iconPath = getEditIconPath();
  // console.log(getEditIconPath());

  const initialValues = {
    stop_name: "",
    stop_lat: "",
    stop_lon: "",
    stop_desc: "",
    agency_id: "LTFRB",
  }

  const onSubmit = async (values: any, formikBag: { setSubmitting: any }) => {
    const { setSubmitting } = formikBag

    console.log(values)
    // TODO : Send data to server

    setTimeout(() => {
      setSubmitting(false)
    }, 1000)

    try {
      // const docQueryRef = doc(db, "stops", values.stop_name)
      // const docSnap = await getDoc(docQueryRef)
      // if (docSnap.exists()) {
      //   Swal.fire("Error", "Stop name already in database", "error")
      //   throw new Error("Stop node already in database")
      // }

      var idNum = -1
      console.log(values.agency_id)
      metaRows.forEach(async (e) => {
        if (e.agency_id === values.agency_id) {
          idNum = e.stopCounter
          await updateDoc(doc(db, "_meta-stops-per-agency", e.id), {
            stopCounter: idNum + 1,
          })
          {
            return
          }
        }
      })

      // Add new entry in metaRows
      if (idNum === -1) {
        await addDoc(collection(db, "_meta-stops-per-agency"), {
          agency_id: values.agency_id,
          stopCounter: 1,
        })
        idNum = 0
      }

      const stop_id = `${values.agency_id}_${idNum.toLocaleString("en-US", {
        minimumIntegerDigits: 4,
        useGrouping: false,
      })}`

      await addDoc(stopsColRef, {
        stop_id: stop_id,
        stop_name: values.stop_name,
        stop_lat: values.stop_lat,
        stop_lon: values.stop_lon,
        stop_desc: values.stop_desc,
      })

      props.callback()
      props.close()

      Swal.fire({
        title: "Added!",
        text: `Stop ID ${stop_id}, "${values.stop_name}" has been added.`,
        icon: "success",
        confirmButtonColor: colors.greenAccent[600],
        cancelButtonColor: colors.redAccent[500],
        background: theme.palette.background.default,
        color: colors.grey[100],
        timer: 1500,
      })
    } catch (e) {
      console.error("Error adding document: ", e)
      props.close()
    }
  }

  // Todo: SHOULD BE PROVIDED VIA HOOK
  const agencyItems = itemizeAgencies(agencyRows)
  // Todo: SHOULD BE PROVIDED VIA HOOK

  return (
    <>
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
              //   bgcolor: "background.paper",
              bgcolor: theme.palette.background.default,
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h4" mb={3}>
              Stop Information
            </Typography>
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={schemas.stopSchema}
            >
              {({ isSubmitting, setFieldValue }) => (
                <>
                  <Form>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Grid item xs={12}>
                          <CustomTextField
                            fullWidth
                            id="stop_name"
                            name="stop_name"
                            label="Stop name"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <CustomTextField
                            id="stop_lat"
                            name="stop_lat"
                            label="Latitude"
                            disabled
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <CustomTextField
                            id="stop_lon"
                            name="stop_lon"
                            label="Longitude"
                            disabled
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <CustomSelect
                            id="agency_id"
                            labelid="agency_id_label"
                            name="agency_id"
                            label="Agency ID"
                            items={agencyItems}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <CustomTextField
                            fullWidth
                            multiline
                            rows={5}
                            id="stop_desc"
                            name="stop_desc"
                            label="Stop description"
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={6}>
                        <LeafletMap
                          id="map"
                          callback={setFieldValue}
                          showDraggableMarker
                          showStopMarkersAsInactive={showInactiveMarkers}
                          markers={markers}
                        />
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid item xs={6}>
                        <Button
                          // fullWidth`
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            setShowInactiveMarkers(!showInactiveMarkers)
                          }
                          sx={{
                            mt: 2,
                            // position: "absolute",
                            // left: "87%",
                            // top: "15%",
                            // transform: "translateX(-50%)",
                            // zIndex: 1000,
                            // width: "175px",
                            color: colors.grey[100],
                            backgroundColor: colors.blueAccent[600],
                            "&:hover": {
                              backgroundColor: colors.blueAccent[700],
                            },
                          }}
                        >
                          Show Other Stops
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Box
                          mt={2}
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Button
                            // fullWidth
                            // variant="contained"
                            // color={theme.palette.primary.main}
                            onClick={props.close}
                            sx={{
                              mr: 2,
                              color: colors.grey[100],
                              backgroundColor: colors.redAccent[500],
                              "&:hover": {
                                backgroundColor: colors.redAccent[600],
                              },
                            }}
                            //                     confirmButtonColor: colors.greenAccent[600],
                            // cancelButtonColor: colors.redAccent[500],
                          >
                            Cancel
                          </Button>
                          <Button
                            // fullWidth
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={isSubmitting}
                            sx={{
                              color: colors.grey[100],
                              backgroundColor: colors.greenAccent[600],
                              "&:hover": {
                                backgroundColor: colors.greenAccent[700],
                              },
                            }}
                          >
                            Add Stop
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Form>
                </>
              )}
            </Formik>
          </Box>
        </Fade>
      </Modal>
    </>
  )
}
