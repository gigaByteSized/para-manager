import { Box } from "@mui/material"
import { Header } from "../../components/Header"
import { Route, Routes } from "react-router-dom"
import { RequestsGrid } from "./RequestsGrid"

export const RequestsManager = () => {
  return (
    <Box m={"20px"}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Header
          title="Route Requests"
          subtitle="Welcome to route requests"
        />
      </Box>
      <Routes>
        <Route path="/" element={<RequestsGrid />} />
      </Routes>
    </Box>
  )
}
