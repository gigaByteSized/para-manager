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
import { CustomSelect } from "../../../components/forms/CustomSelect"
import { ItemizeRouteTypes } from "../../../services/ItemizeRouteTypes"
import { LocalizeRouteTypes } from "../../../services/LocalizeRouteTypes"
import { useEffect, useState } from "react"
import { itemizeAgencies } from "../../../services/itemizeAgencies"
import { ShortenRouteType } from "../../../services/ShortenRouteType"

export const AddModal = (props) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const [agencyRows, setAgencyRows] = useState([])
  const [metaRows, setMetaRows] = useState([])
  const agencyColRef = collection(db, "agency")
  const metaColRef = collection(db, "_meta-routes-per-agency-and-type")

  useEffect(() => {
    fetchAgencies()
    fetchRoutesPerAgency()
  }, [])

  const fetchAgencies = async () => {
    const data = await getDocs(agencyColRef)
    setAgencyRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  }

  const fetchRoutesPerAgency = async () => {
    const data = await getDocs(metaColRef)
    setMetaRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  }

  const initialValues = {
    route_long_name: "",
    route_short_name: "",
    route_type: "",
    route_desc: "",
    agency_id: "LTFRB",
  }

  const onSubmit = async (values: any, formikBag: { setSubmitting: any }) => {
    const { setSubmitting } = formikBag

    // console.log(values)

    setTimeout(() => {
      setSubmitting(false)
    }, 1000)

    try {
      var idNum = -1
      console.log(values.route_type)
      const agency_id_type_id = `${values.agency_id}_${ShortenRouteType(values.route_type)}`
      metaRows.forEach(async (e) => {
        if (e.agency_id_type_id === agency_id_type_id) {
          idNum = e.routeCounter
          await updateDoc(doc(db, "_meta-routes-per-agency-and-type", e.id), {
            routeCounter: idNum + 1,
          })
          {
            return
          }
        }
      })
      // If agency_id is not found in metaRows
      // Add new entry in metaRows
      if (idNum === -1) {
        await addDoc(collection(db, "_meta-routes-per-agency-and-type"), {
          agency_id_type_id: agency_id_type_id,
          routeCounter: 1,
        })
        idNum = 0
      }

      // const route_id = `${agency_id_type_id}${idNum}`
      const route_id = `${agency_id_type_id}${idNum.toLocaleString("en-US", {
        minimumIntegerDigits: 4,
        useGrouping: false,
      })}`

      // console.log(route_id)

      // const docQueryRef = doc(db, "routes", values.agency_id)
      // const docSnap = await getDoc(docQueryRef)
      // if (docSnap.exists()) {
      //   Swal.fire("Error", "Route already in database", "error")
      //   throw new Error("Route already in database")
      // }

      await addDoc(collection(db, "routes"), {
        route_id: route_id,
        agency_id: values.agency_id,
        route_long_name: values.route_long_name,
        route_short_name: values.route_short_name,
        route_type: values.route_type,
        route_desc: values.route_desc,
      })
      props.callback()
      props.close()

      Swal.fire({
        title: "Added!",
        text: `Route ID ${route_id}, "${
          values.route_long_name || values.route_short_name
        }" has been added.`,
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
  const localizedRouteTypes = LocalizeRouteTypes([1945, 2000, 3, 2016, 2017])
  const itemizedRouteTypes = ItemizeRouteTypes(localizedRouteTypes)
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
            <Typography variant="h2" mb={3}>
              Route Information
            </Typography>
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={schemas.routeSchema}
            >
              {({ isSubmitting }) => (
                <>
                  <Form>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Grid item xs={12}>
                          <CustomTextField
                            fullWidth
                            id="route_short_name"
                            name="route_short_name"
                            label="Route short name"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <CustomTextField
                            id="route_long_name"
                            name="route_long_name"
                            label="Route long name"
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
                          <CustomSelect
                            id="route_type"
                            labelid="route_type_label"
                            name="route_type"
                            label="Route Type"
                            items={itemizedRouteTypes}
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={6}>
                        <CustomTextField
                          fullWidth
                          multiline
                          rows={11}
                          id="route_desc"
                          name="route_desc"
                          label="Route description"
                        />
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
                        Add Route
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
