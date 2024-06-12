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
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../../../firebase-config"
import Swal from "sweetalert2"
import { useEffect, useState } from "react"
import dayjs from "dayjs"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc)
dayjs.extend(timezone)

export const EditModal = (props) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const initialValues = props.initialValues || {
    id: "",
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

  // useEffect(() => {
  //   setDay({
  //     monday: initialValues.monday,
  //     tuesday: initialValues.tuesday,
  //     wednesday: initialValues.wednesday,
  //     thursday: initialValues.thursday,
  //     friday: initialValues.friday,
  //     saturday: initialValues.saturday,
  //     sunday: initialValues.sunday,
  //   })

  // }, [dayUpdated])

  const [startDate, setStartDate] = useState(dayjs(initialValues.start_date))
  const [endDate, setEndDate] = useState(dayjs(initialValues.end_date))

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
    monday: initialValues.monday ? btnSelectedConfigs.sx : btnUnselectedConfigs.sx,
    tuesday: initialValues.tuesday ? btnSelectedConfigs.sx : btnUnselectedConfigs.sx,
    wednesday: initialValues.wednesday ? btnSelectedConfigs.sx : btnUnselectedConfigs.sx,
    thursday: initialValues.thursday ? btnSelectedConfigs.sx : btnUnselectedConfigs.sx,
    friday: initialValues.friday ? btnSelectedConfigs.sx : btnUnselectedConfigs.sx,
    saturday: initialValues.saturday ? btnSelectedConfigs.sx : btnUnselectedConfigs.sx,
    sunday: initialValues.sunday ? btnSelectedConfigs.sx : btnUnselectedConfigs.sx,
  })

  useEffect(() => {
    setBtnSx({
      monday: initialValues.monday ? btnSelectedConfigs.sx : btnUnselectedConfigs.sx,
      tuesday: initialValues.tuesday ? btnSelectedConfigs.sx : btnUnselectedConfigs.sx,
      wednesday: initialValues.wednesday ? btnSelectedConfigs.sx : btnUnselectedConfigs.sx,
      thursday: initialValues.thursday ? btnSelectedConfigs.sx : btnUnselectedConfigs.sx,
      friday: initialValues.friday ? btnSelectedConfigs.sx : btnUnselectedConfigs.sx,
      saturday: initialValues.saturday ? btnSelectedConfigs.sx : btnUnselectedConfigs.sx,
      sunday: initialValues.sunday ? btnSelectedConfigs.sx : btnUnselectedConfigs.sx,
    })

    setStartDate(dayjs(initialValues.start_date))
    setEndDate(dayjs(initialValues.end_date))

  }, [initialValues.monday])

  // const weekBtnOnclick = (dayArg, setFieldValue) => {
  //   if (day[dayArg] === 1) {
  //     setBtnSx((prevState) => ({
  //       ...prevState,
  //       [dayArg]: btnUnselectedConfigs.sx,
  //     }))
  //     setDay((prevState) => ({
  //       ...prevState,
  //       [dayArg]: 0,
  //     }))
  //     setFieldValue(dayArg, 0)
  //   } else {
  //     setBtnSx((prevState) => ({
  //       ...prevState,
  //       [dayArg]: btnSelectedConfigs.sx,
  //     }))
  //     setDay((prevState) => ({
  //       ...prevState,
  //       [dayArg]: 1,
  //     }))
  //     setFieldValue(dayArg, 1)
  //   }
  // }

  const weekBtnOnclick = (dayArg, setFieldValue) => {
    if (initialValues[dayArg] === 1) {
      setBtnSx((prevState) => ({
        ...prevState,
        [dayArg]: btnUnselectedConfigs.sx,
      }))
      setFieldValue(dayArg, 0)
    } else {
      setBtnSx((prevState) => ({
        ...prevState,
        [dayArg]: btnSelectedConfigs.sx,
      }))
      setFieldValue(dayArg, 1)
    }
  }


  const onSubmit = async (values: any, formikBag: { setSubmitting: any }) => {
    const { setSubmitting } = formikBag

    console.log(values)

    setTimeout(() => {
      setSubmitting(false)
    }, 1000)

    try {
      await updateDoc(doc(db, "calendar", values.id), {
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
        title: "Updated!",
        text: `Service ID ${values.service_id} has been updated.`,
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

                            <Typography variant="h5">{"to"}</Typography>

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
                        Save Changes
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