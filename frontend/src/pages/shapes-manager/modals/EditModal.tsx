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
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore"
import { db } from "../../../firebase-config"
import Swal from "sweetalert2"
import { LeafletMap } from "../../../components/LeafletMap"
import { useEffect, useState } from "react"

export const EditModal = (props) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)


  const initialValues = props.initialValues || {
    id: "",
    stop_name: "",
    stop_lat: "",
    stop_lon: "",
    stop_desc: "",
  }

  const onSubmit = async (values: any, formikBag: { setSubmitting: any }) => {
    const { setSubmitting } = formikBag

    console.log(values)

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

      await updateDoc(doc(db, "stops", values.id), {
        stop_name: values.stop_name,
        stop_lat: values.stop_lat,
        stop_lon: values.stop_lon,
        stop_desc: values.stop_desc,
      })
      props.callback()
      props.close()

      Swal.fire({
        title: "Updated!",
        text: `Stop ID ${values.stop_id}, "${values.stop_name}" has been updated.`,
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
                          <CustomTextField
                            fullWidth
                            multiline
                            rows={8}
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
                          zoom={18}
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
                        Update
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
