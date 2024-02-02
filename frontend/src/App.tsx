import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { ColorModeContext, useMode } from "./theme"
import { TopBar } from './components/global/TopBar'
import { ProSideBar } from './components/global/ProSideBar'
import { Theme } from '@emotion/react'
import { Dashboard } from './pages/dashboard'
import Modeler from './pages/Modeler'
// import { Dashboard } from './pages/Dashboard'



const App = () => {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode as { toggleColorMode: () => void; }}>
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
              <Route path="/route-modeler" element={<Modeler />} />
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
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App