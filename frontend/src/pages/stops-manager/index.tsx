import { Box } from "@mui/material"
import { Header } from "../../components/Header"
import { Route, Routes } from "react-router-dom"
import { StopsGrid } from "./StopsGrid"
import { StopsViewer } from "./StopsViewer"


export const StopsManager = () => {
  return (
    <Box m={"20px"}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Header title="Stops" subtitle="Welcome to stops" />
      </Box>
      <Routes>
              <Route path="/" element={<StopsGrid />} />
              <Route path="/viewer" element={<StopsViewer />} />
              {/* <Route path="/team" element={<Team />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} /> */}
            </Routes>
    </Box>
  )
}
