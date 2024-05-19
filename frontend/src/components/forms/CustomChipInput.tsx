import TextField, { TextFieldProps } from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";

export const CustomChipInput = (props: TextFieldProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <TextField
      {...props}
      sx={{
        mb: 3,
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
            borderColor: colors.grey[100],
          },
          "&:hover fieldset": {
            borderColor: colors.greenAccent[300],
          },
          "&.Mui-focused fieldset": {
            borderColor: colors.greenAccent[400],
          },
        },
      }}
      // Pass any necessary props
    />
  );
};

