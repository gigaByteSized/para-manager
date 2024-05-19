import React, { useState } from "react"
import { Routes, Route } from "react-router-dom"
import { ThemeProvider, CssBaseline } from "@mui/material"
import { ColorModeContext, useMode } from "./theme"
import { TopBar } from "./components/global/TopBar"
import { ProSideBar } from "./components/global/ProSideBar"
import { Theme } from "@emotion/react"
import { Dashboard } from "./pages/dashboard"
import { RoutesManager } from "./pages/routes-manager"
// import Modeler from './pages/route-manager/Modeler'
import { AgencyManager } from "./pages/agency-manager"
import { StopsManager } from "./pages/stops-manager"
import { StopsViewer } from "./pages/stops-manager/StopsViewer"
import { CalendarManager } from "./pages/calendar-manager"
import { TripsManager } from "./pages/trips-manager"
import { ShapesManager } from "./pages/shapes-manager"
// import { Dashboard } from './pages/Dashboard'

const App = () => {
  const [theme, colorMode] = useMode()
  const [isSidebar, setIsSidebar] = useState(true)

  return (
      <ColorModeContext.Provider
        value={colorMode as { toggleColorMode: () => void }}
      >
        <ThemeProvider theme={theme as Theme}>
          <CssBaseline />
          <div className="app">
            <ProSideBar />
            {/* <ProSideBar isSidebar={isSidebar} /> */}
            <main className="content">
              {/* <TopBar setIsSidebar={setIsSidebar} /> */}
              <TopBar />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/viewer" element={<StopsViewer />} />
                <Route path="/agency/*" element={<AgencyManager />} />
                <Route path="/routes/*" element={<RoutesManager />} />
                <Route path="/stops/*" element={<StopsManager />} />
                <Route path="/calendar/*" element={<CalendarManager />} />
                <Route path="/trips/*" element={<TripsManager />} />
                <Route path="/shapes/*" element={<ShapesManager />} />
                {/* <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} /> */}
              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
  )
}

export default App
