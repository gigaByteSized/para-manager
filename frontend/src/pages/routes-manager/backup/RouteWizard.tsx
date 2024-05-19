import * as React from "react"
import Box from "@mui/material/Box"
import Stepper from "@mui/material/Stepper"
import Step from "@mui/material/Step"
import StepLabel from "@mui/material/StepLabel"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { useTheme } from "@mui/material/styles"
import { tokens } from "../../theme"
import { LeafletMap } from "../../components/LeafletMap"
import { Formik, Form } from "formik"
import * as schemas from "../../schemas"
import { getCurrentPosition } from "../../services/GetCurrentPosition"
import { GeneralRouteInfo } from "./GeneralRouteInfo"
import { useNavigate } from "react-router-dom"

const stepLabels = [
  "General route information",
  "Route plotter",
  "Review and save route",
]

export const RouteWizard = () => {
  const navigate = useNavigate()
  const initialValues = {
    route_long_name: "",
    route_short_name: "",
    route_type: "",
    route_desc: "",
  }
  const coords = getCurrentPosition()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set<number>())
  console.log(activeStep)
  const isStepSkipped = (step: number) => {
    return skipped.has(step)
  }

  const isLastStep = () => {
    return activeStep === stepLabels.length - 1
  }

  const onSubmit = (values: any, formikBag: { setSubmitting: any }) => {
    const { setSubmitting } = formikBag

    if (!isLastStep()) {
      console.log("here")
      setSubmitting(false)
      handleNext()
      return
    }

    console.log(values)
    // TODO : Send data to server

    setTimeout(() => {
      setSubmitting(false)
    }, 1000)

    // TODO : Check sent data status
    // TODO : Show success or error message

    // go back to route grid
    navigate("/routes")
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
      navigate("/routes")
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  return (
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
          validationSchema={schemas.routeSchema}
        >
          {({ isSubmitting, touched, values }) => (
            <>
              <Form>
                <Stepper activeStep={activeStep}>
                  {stepLabels.map((label, index) => {
                    const stepProps: { completed?: boolean } = {}
                    const labelProps: {
                      optional?: React.ReactNode
                    } = {}

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
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
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
                      {activeStep === 0 && GeneralRouteInfo()}
                      {activeStep === 1 && (
                        <LeafletMap
                          center={
                            coords !== undefined
                              ? [coords.latitude, coords.longitude]
                              : [14.1651, 121.2402]
                          }
                        />
                      )}
                      {activeStep === 2 && (
                        <>
                          <Typography>Review and save route</Typography>
                          <Typography>Data for review goes here</Typography>
                        </>
                      )}
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                      <Button
                        color="inherit"
                        // disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
                        {activeStep === 0 ? "Cancel" : "Back"}
                      </Button>
                      <Box sx={{ flex: "1 1 auto" }} />
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
              <pre>{JSON.stringify(values, null, 2)}</pre>
              <pre>{JSON.stringify(touched, null, 2)}</pre>
            </>
          )}
        </Formik>
      </Box>
    </Box>
  )
}
