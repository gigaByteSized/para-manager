import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { useField } from "formik";

export const CustomTextField = (props: any) => {
  const [field, meta] = useField(props);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const configs = {
    ...field,
    ...props,
    fullWidth: true,
    sx: {
      mb: 2,
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
  }

  if(meta && meta.touched && meta.error) {
    configs.error = true;
    configs.helperText = meta.error;
  }

  return (
    <TextField
      {...configs}
    />
  );
};

export default CustomTextField;
