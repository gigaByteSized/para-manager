import { Box, Icon, IconButton, Typography, useTheme } from "@mui/material"
import { useContext } from "react"
import { ColorModeContext, tokens } from "../../theme"
import InputBase from "@mui/material"
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined"
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined"
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined"
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined"

export const TopBar = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const colorMode = useContext(ColorModeContext)

  return (
    // <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
      {/* TODO: HIDE WHEN SIDBAR IS SHOWN */}
      <Typography variant="h1" color={colors.grey[100]} fontWeight="bold">
        PARA! Manager
      </Typography>
      <Box
        sx={{
          display: "flex",
          // backgroundColor: colors.primary[400],
          // borderRadius: "3px",
        }}
      >
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        {/* <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton>
          <PersonOutlinedIcon />
        </IconButton> */}
      </Box>
    </Box>
  )
}
