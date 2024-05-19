import Typography from "@mui/material/Typography"
import { Grid, TextField } from "@mui/material"
import { CustomTextField } from "../../components/forms/CustomTextField"
import { CustomSelect } from "../../components/forms/CustomSelect"
import { LocalizeRouteTypes } from "../../services/LocalizeRouteTypes"
import { ItemizeRouteTypes } from "../../services/ItemizeRouteTypes"

export const GeneralRouteInfo = () => {
  // Todo: SHOULD BE PROVIDED VIA HOOK
  const localizedRouteTypes = LocalizeRouteTypes([1945, 2000, 2001, 2017])
  const itemizedRouteTypes = ItemizeRouteTypes(localizedRouteTypes)
  // Todo: SHOULD BE PROVIDED VIA HOOK

  return (
    <>
      <Typography variant="h4" mb={3}>
        Route Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Grid item xs={12}>
            <CustomTextField
              id="route_long_name"
              name="route_long_name"
              label="Route long name"
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              id="route_short_name"
              name="route_short_name"
              label="Route short name"
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
            rows={8}
            id="route_desc"
            name="route_desc"
            label="Route description"
          />
        </Grid>

        {/* <Grid item xs={12}>
  
              </Grid> */}
      </Grid>
    </>
  )
}
