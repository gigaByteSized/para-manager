import { Box } from "@mui/material";
import { Header } from "../../components/Header";
// import { RouteWizard } from "./RouteWizard";
import { Route, Routes } from "react-router-dom";
import { TripGrid } from "./TripGrid";
import { TripWizard } from "./wizard/TripWizard";

export const TripsManager = () => {
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
            element={<Header title="Trips" subtitle="Welcome to trips" />}
          />
          // Todo: nav button back to index
        </Routes>
      </Box>
      <Routes>
        {/* Just in case */}
        <Route path="/" element={<TripGrid />} />
        <Route path="/wizard" element={<TripWizard />} />
      </Routes>
    </Box>
  );
};
