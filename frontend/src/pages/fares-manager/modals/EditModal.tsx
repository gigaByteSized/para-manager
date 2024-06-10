import {
  Modal,
  Backdrop,
  Fade,
  Box,
  Typography,
  Grid,
  Button,
  useTheme,
  InputAdornment,
} from "@mui/material"
import CustomTextField from "../../../components/forms/CustomTextField"
import { Formik, Form } from "formik"
import * as schemas from "../../../schemas"
import { tokens } from "../../../theme"
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore"
import { db } from "../../../firebase-config"
import Swal from "sweetalert2"

export const EditModal = (props) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const initialValues = props.initialValues || {
    id: "",
    route_type: "",
    minimum_distance: "",
    base_fare_regular: "",
    succeeding_regular: "",
    base_fare_discounted: "",
    succeeding_discounted: "",
  }

  const onSubmit = async (values: any, formikBag: { setSubmitting: any }) => {
    const { setSubmitting } = formikBag

    console.log(values)

    setTimeout(() => {
      setSubmitting(false)
    }, 1000)

    try {
      await updateDoc(doc(db, "_meta-fares-per-type-and-class", values.id), {
        route_type: values.route_type,
        minimum_distance: values.minimum_distance as number,
        base_fare_regular: values.base_fare_regular as number,
        succeeding_regular: values.succeeding_regular as number,
        base_fare_discounted: values.base_fare_discounted as number,
        succeeding_discounted: values.succeeding_discounted as number,
      })
      props.callback()
      props.close()

      Swal.fire({
        title: "Updated!",
        text: `Fares for ${values.route_type} has been updated.`,
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
              //   bgcolor: "background.paper",
              bgcolor: theme.palette.background.default,
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h2" mb={3}>
              Route Information
            </Typography>
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={schemas.fareSchema}
            >
              {({ isSubmitting }) => (
                <>
                  <Form>
                    <Grid container>
                      <Grid container>
                      <Grid container spacing={2}>
                        <Grid item xs={9}>
                          <CustomTextField
                            id="route_type"
                            labelid="route_type_label"
                            name="route_type"
                            label="Route type"
                            value={initialValues.route_type}
                            disabled
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <CustomTextField
                            fullWidth
                            id="minimum_distance"
                            name="minimum_distance"
                            label="Base fare minimum"
                            type="number"
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="start">
                                  km
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={3}>
                          <CustomTextField
                            fullWidth
                            id="base_fare_regular"
                            name="base_fare_regular"
                            label="Base fare (Regular)"
                            type="number"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  ₱
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <CustomTextField
                            id="succeeding_regular"
                            name="succeeding_regular"
                            label="Increment per succeeding km (Regular)"
                            type="number"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  ₱
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <CustomTextField
                            id="base_fare_discounted"
                            name="base_fare_discounted"
                            label="Base fare (Discounted)"
                            type="number"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  ₱
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <CustomTextField
                            id="succeeding_discounted"
                            name="succeeding_discounted"
                            label="Increment per succeeding km (Discounted)"
                            type="number"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  ₱
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                      </Grid>

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
                        Update Fares
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
