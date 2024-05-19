import {
  Modal,
  Backdrop,
  Fade,
  Box,
  Typography,
  Grid,
  Button,
  useTheme,
  CircularProgress,
} from "@mui/material"
import CustomTextField from "../../../components/forms/CustomTextField"
import { Formik, Form } from "formik"
import * as schemas from "../../../schemas"
import { tokens } from "../../../theme"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../../../firebase-config"
import Swal from "sweetalert2"
import { useState } from "react"

export const EditModal = (props) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const [open, setOpen] = useState(false)
  const handleClose = () => {
    setOpen(false)
  }
  const handleOpen = () => {
    setOpen(true)
  }

  const initialValues = props.initialValues || {
    id: "",
    agency_id: "",
    agency_name: "",
    agency_url: "",
    agency_timezone: "Asia/Manila",
    agency_lang: "en/ph",
    agency_phone: "",
    agency_fare_url: "",
    agency_email: "",
  }

  const onSubmit = async (values: any, formikBag: { setSubmitting: any }) => {
    handleOpen()

    try {
      await updateDoc(doc(db, "agency", values.id), {
        agency_id: values.agency_id,
        agency_name: values.agency_name,
        agency_url: values.agency_url,
        agency_timezone: values.agency_timezone,
        agency_lang: values.agency_lang,
        agency_phone: values.agency_phone,
        agency_fare_url: values.agency_fare_url,
        agency_email: values.agency_email,
      })
      props.callback()
      props.close()
      Swal.fire({
        title: "Updated!",
        text: `Agency ID ${values.agency_id}, "${values.agency_name}" has been updated.`,
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
    handleClose()
  }

  return (
    <>
      <Backdrop
        sx={{ color: colors.blueAccent[500], zIndex: 99999 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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
              Route Information
            </Typography>
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={schemas.agencySchema}
            >
              {({ isSubmitting }) => (
                <>
                  <Form>
                    <Grid container>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <CustomTextField
                            id="agency_id"
                            name="agency_id"
                            label="Agency ID"
                          />
                        </Grid>
                        <Grid item xs={8}>
                          <CustomTextField
                            fullWidth
                            id="agency_name"
                            name="agency_name"
                            label="Agency Name"
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField
                          fullWidth
                          id="agency_url"
                          name="agency_url"
                          label="Agency URL"
                        />
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <CustomTextField
                            id="agency_timezone"
                            name="agency_timezone"
                            label="Agency Timezone"
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <CustomTextField
                            id="agency_lang"
                            name="agency_lang"
                            label="Agency Language"
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <CustomTextField
                            id="agency_phone"
                            name="agency_phone"
                            label="Agency Phone"
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField
                          fullWidth
                          id="agency_fare_url"
                          name="agency_fare_url"
                          label="Agency Fare URL"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField
                          fullWidth
                          id="agency_email"
                          name="agency_email"
                          label="Agency Email"
                        />
                      </Grid>
                    </Grid>
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
                      Save
                    </Button>
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
