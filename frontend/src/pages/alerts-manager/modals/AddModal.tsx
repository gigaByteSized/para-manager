import {
  Modal,
  Backdrop,
  Fade,
  Box,
  Typography,
  Grid,
  Button,
  useTheme,
  ButtonGroup,
} from "@mui/material"
import CustomTextField from "../../../components/forms/CustomTextField"
import { Formik, Form } from "formik"
import * as schemas from "../../../schemas"
import { tokens } from "../../../theme"
import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore"
import { db } from "../../../firebase-config"
import Swal from "sweetalert2"
import { useEffect, useState } from "react"
import dayjs, { Dayjs } from "dayjs"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc)
dayjs.extend(timezone)

export const AddModal = (props) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const calendarColRef = collection(db, "calendar")


  const [open, setOpen] = useState(false)
  const handleClose = () => {
    setOpen(false)
  }
  const handleOpen = () => {
    setOpen(true)
  }

  const [day, setDay] = useState({
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0,
    saturday: 0,
    sunday: 0,
  })

  const [startDate, setStartDate] = useState(dayjs(new Date()))
  const [endDate, setEndDate] = useState(dayjs(new Date()))

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

  const [btnSx, setBtnSx] = useState({
    monday: btnUnselectedConfigs.sx,
    tuesday: btnUnselectedConfigs.sx,
    wednesday: btnUnselectedConfigs.sx,
    thursday: btnUnselectedConfigs.sx,
    friday: btnUnselectedConfigs.sx,
    saturday: btnUnselectedConfigs.sx,
    sunday: btnUnselectedConfigs.sx,
  })

  const weekBtnOnclick = (dayArg, setFieldValue) => {
    if (day[dayArg] === 1) {
      setBtnSx((prevState) => ({
        ...prevState,
        [dayArg]: btnUnselectedConfigs.sx,
      }))
      setDay((prevState) => ({
        ...prevState,
        [dayArg]: 0,
      }))
      setFieldValue(dayArg, 0)
    } else {
      setBtnSx((prevState) => ({
        ...prevState,
        [dayArg]: btnSelectedConfigs.sx,
      }))
      setDay((prevState) => ({
        ...prevState,
        [dayArg]: 1,
      }))
      setFieldValue(dayArg, 1)
    }
  }

  const initialValues = {
    service_id: "",
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0,
    saturday: 0,
    sunday: 0,
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
  }

  const onSubmit = async (values: any, formikBag: { setSubmitting: any }) => {
    const { setSubmitting } = formikBag

    console.log(values)
    // TODO : Send data to server

    setTimeout(() => {
      setSubmitting(false)
    }, 1000)


    try {
      await addDoc(calendarColRef, {
        service_id: values.service_id,
        monday: values.monday,
        tuesday: values.tuesday,
        wednesday: values.wednesday,
        thursday: values.thursday,
        friday: values.friday,
        saturday: values.saturday,
        sunday: values.sunday,
        start_date: values.start_date,
        end_date: values.end_date,
      })

      props.callback()
      props.close()

      Swal.fire({
        title: "Added!",
        text: `Service ID ${values.service_id} has been added.`,
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
              width: "900px",
              //   bgcolor: "background.paper",
              bgcolor: theme.palette.background.default,
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h4" mb={3}>
              Service Calendar Information
            </Typography>
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={schemas.calendarSchema}
            >
              {({ isSubmitting, setFieldValue }) => (
                <>
                  <Form>
                    <Grid container>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <CustomTextField
                            id="service_id"
                            name="service_id"
                            label="Service ID"
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <ButtonGroup
                          variant="contained"
                          sx={{
                            display: "flex",
                            alignContent: "center",
                            justifyContent: "center",
                            alignItems: "center",
                            mb: 3,
                            mt: 1,
                          }}
                        >
                          <Button
                            onClick={() => {
                              weekBtnOnclick("monday", setFieldValue)
                            }}
                            sx={btnSx.monday}
                          >
                            Monday
                          </Button>
                          <Button
                            onClick={() => {
                              weekBtnOnclick("tuesday", setFieldValue)
                            }}
                            sx={btnSx.tuesday}
                          >
                            Tuesday
                          </Button>
                          <Button
                            onClick={() => {
                              weekBtnOnclick("wednesday", setFieldValue)
                            }}
                            sx={btnSx.wednesday}
                          >
                            Wednesday
                          </Button>
                          <Button
                            onClick={() => {
                              weekBtnOnclick("thursday", setFieldValue)
                            }}
                            sx={btnSx.thursday}
                          >
                            Thursday
                          </Button>
                          <Button
                            onClick={() => {
                              weekBtnOnclick("friday", setFieldValue)
                            }}
                            sx={btnSx.friday}
                          >
                            Friday
                          </Button>
                          <Button
                            onClick={() => {
                              weekBtnOnclick("saturday", setFieldValue)
                            }}
                            sx={btnSx.saturday}
                          >
                            Saturday
                          </Button>
                          <Button
                            onClick={() => {
                              weekBtnOnclick("sunday", setFieldValue)
                            }}
                            sx={btnSx.sunday}
                          >
                            Sunday
                          </Button>
                        </ButtonGroup>
                        {/* </Box> */}
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
                            <DatePicker
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
                            />

                            <Typography variant="h5"> {"to"}</Typography>

                            <DatePicker
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
                            />
                          </LocalizationProvider>
                        </Box>
                      </Grid>
                      {/* <Grid item xs={12}>
                        <CustomTextField
                          fullWidth
                          id="agency_fare_url"
                          name="agency_fare_url"
                          label="Agency Fare URL"
                        />
                      </Grid> */}

                      {/* <Grid item xs={12}>
  
              </Grid> */}
                    </Grid>
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
                        Add Calendar
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
