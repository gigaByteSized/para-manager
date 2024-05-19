import { Box } from "@mui/material";
import { Header } from "../../components/Header";
// import { RouteWizard } from "./RouteWizard";
import { Route, Routes } from "react-router-dom";
import { RouteGrid } from "./RouteGrid";

export const RoutesManager = () => {
  return (
    <Box m={"20px"}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        {/* <Header title="Routes" subtitle="Welcome to routes" /> */}
        <Routes>
          <Route
            path="/"
            element={<Header title="Routes" subtitle="Welcome to routes" />}
          />
          // Todo: nav button back to index
        </Routes>
      </Box>
      <Routes>
        {/* Just in case */}
        <Route path="/" element={<RouteGrid />} />
        {/* <Route path="/modeler" element={<RouteWizard />} /> */}
      </Routes>
    </Box>
  );
};
