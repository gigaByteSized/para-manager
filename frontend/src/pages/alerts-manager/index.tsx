import { Box } from "@mui/material"
import { Header } from "../../components/Header"
import { Route, Routes } from "react-router-dom"
import { AlertsGrid } from "./AlertsGrid"

export const CalendarManager = () => {
  return (
    <Box m={"20px"}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Header
          title="Community Alerts"
          subtitle="Welcome to community alerts"
        />
      </Box>
      <Routes>
        <Route path="/" element={<AlertsGrid />} />
      </Routes>
    </Box>
  )
}
