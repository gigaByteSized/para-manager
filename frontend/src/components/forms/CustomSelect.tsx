import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import { FormControl, FormHelperText } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { tokens } from "../../theme"
import { useField, useFormikContext } from "formik"

const buildMenuItems = (items: string[]) => {
  return items.map((item, index) => {
    return (
      <MenuItem key={index} value={item}>
        {item}
      </MenuItem>
    )
  })
}

export const CustomSelect = (props: any) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const { setFieldValue } = useFormikContext()
  const [field, meta] = useField(props)

  const handleChange = (event: { target: { value: any } }) => {
    const { value } = event.target
    setFieldValue(field.name, value)
    // setSelected(event.target.value);
  }

  const configs = {
    ...field,
    ...props,
    fullWidth: true,
    sx: {
      mb: 1,
      "& .MuiFormLabel-root": {
        color: colors.grey[100],
      },
      "& .css-1o99p6p-MuiFormLabel-root-MuiInputLabel-root.Mui-focused": {
        color: colors.greenAccent[400],
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
    },
  }

  if (meta && meta.touched && meta.error) {
    configs.error = true
    configs.helpertext = meta.error
  }

  return (
    <>
      <FormControl {...configs}>
        <InputLabel
          id={props.labelid}
          sx={
            {
              // color: colors.grey[100],
              // ".css-1652pyl-MuiFormLabel-root-MuiInputLabel-root.Mui-focused": {
              //   color: colors.greenAccent[400],
              // },
            }
          }
        >
          {props.label}
        </InputLabel>
        <Select
          id={props.id}
          value={field.value}
          onChange={handleChange}
          {...props}
        >
          {/* <MenuItem value="">
            <em>None</em>
          </MenuItem> */}
          {buildMenuItems(props.items)}
        </Select>
        <FormHelperText>{configs.helpertext}</FormHelperText>
      </FormControl>
    </>
  )
}
