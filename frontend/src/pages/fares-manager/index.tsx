import { Box } from "@mui/material"
import { Header } from "../../components/Header"
import { Route, Routes } from "react-router-dom"
import { FaresGrid } from "./FaresGrid"


export const FaresManager = () => {
  return (
    <Box m={"20px"}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Header title="Shapes" subtitle="Welcome to shapes" />
      </Box>
      <Routes>
              <Route path="/" element={<FaresGrid />} />
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
