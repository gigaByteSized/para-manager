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
  GeoPoint,
  Timestamp,
  doc,
  updateDoc,
} from "firebase/firestore"
import { db } from "../../../firebase-config"
import Swal from "sweetalert2"
import { useEffect, useState } from "react"
import { LeafletMap } from "../../../components/LeafletMap"
import useSessionStorage from "../../../hooks/useSessionStorage"
import dayjs from "dayjs"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import { latLng } from "leaflet"

dayjs.extend(utc)
dayjs.extend(timezone)

export const EditModal = (props) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  console.log(props.initialValues)

  const initialValues = props.initialValues || {
    id: "",
    alertName: "",
    alertNotes: "",
    coordinates: new GeoPoint(0, 0),
    expiryDate: new Timestamp(0, 0),
  }

  const [expiryDate, setExpiryDate] = useState(dayjs.unix(initialValues.expiryDate.seconds))
  
  const onSubmit = async (values: any, formikBag: { setSubmitting: any }) => {
    console.log("values", values)
    const { setSubmitting } = formikBag

    console.log(values)

    setTimeout(() => {
      setSubmitting(false)
    }, 1000)

    try {
      const ttl = dayjs(expiryDate)

      await updateDoc(doc(db, "_meta-community-alerts", values.id), {
        alertName: values.alertName,
        alertNotes: values.alertNotes,
        coordinates: new GeoPoint(values.stop_lat, values.stop_lon),
        expiryDate: new Timestamp(ttl.unix(), 0),
      })

      props.callback()
      props.close()

      Swal.fire({
        title: "Updated!",
        text: `"${values.alertName}" has been updated.`,
        icon: "success",
        confirmButtonColor: colors.greenAccent[600],
        cancelButtonColor: colors.redAccent[500],
        background: theme.palette.background.default,
        color: colors.grey[100],
        timer: 1500,
      })
    } catch (e) {
      console.error("Error updating document: ", e)
      props.close()
    }
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
              Stop Information
            </Typography>
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={schemas.alertSchema}
            >
              {({ isSubmitting, setFieldValue }) => (
                <>
                  <Form>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Grid item xs={12}>
                          <CustomTextField
                            fullWidth
                            id="alertName"
                            name="alertName"
                            label="Alert name"
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
                          <CustomTextField
                            fullWidth
                            multiline
                            rows={5}
                            id="alertNotes"
                            name="alertNotes"
                            label="AlertNotes"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="ExpiryDate"
                              value={expiryDate}
                              slotProps={{ textField: { fullWidth: true } }}
                              onChange={(newValue) => {
                                setExpiryDate(newValue)
                                setFieldValue(
                                  "alertTTL",
                                  newValue
                                    .tz("Asia/Manila")
                                    .format("YYYY-MM-DD")
                                )
                              }}
                              sx={dateTimePickerSx}
                            />
                          </LocalizationProvider>
                        </Grid>
                      </Grid>
                      <Grid item xs={6}>
                        <LeafletMap
                          id="map"
                          callback={setFieldValue}
                          draggableMarkerPosition={{lat: initialValues.coordinates.latitude, lng: initialValues.coordinates.longitude}}
                          showDraggableMarker
                          editMode
                          height="43vh"
                        />
                      </Grid>
                    </Grid>
                    <Box
                      mt={2}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        onClick={props.close}
                        sx={{
                          mr: 2,
                          color: colors.grey[100],
                          backgroundColor: colors.redAccent[500],
                          "&:hover": {
                            backgroundColor: colors.redAccent[600],
                          },
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
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
                        Update Alert
                      </Button>
                    </Box>
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