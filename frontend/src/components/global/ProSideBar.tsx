import { useState } from "react"
import { Link } from "react-router-dom"
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar"
import { Box, Icon, IconButton, Typography, useTheme } from "@mui/material"
// import DashboardIcon from "@mui/icons-material/Dashboard"
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined"
import { ListItemText } from "@mui/material"
import { tokens } from "../../theme"
import PersonIcon from "@mui/icons-material/Person"


// TODO : ICONS TO FOLLOW

const Item = ({ title, to, icon, selected, setSelected }: any) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  )
}

export const ProSideBar = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selected, setSelected] = useState("Dashboard")

  return (
    <Box
      sx={{
        // "& .pro-sidebar-inner": {
        //   background: `${colors.primary[400]} !important`,
        // },
        // "& .pro-icon-wrapper": {
        //   backgroundColor: "transparent !important",
        // },
        // "& .pro-inner-item": {
        //   backgroundColor: "5px 35px 5px 20px !important",
        // },
        "& .ps-menu-button:hover": {
          color: "#868dfb !important",
          backgroundColor: "transparent !important",
        },
        "& .ps-active": {
          color: "#6870fa !important",
        },
      }}
    >
      <Sidebar
        collapsed={isCollapsed}
        backgroundColor={colors.primary[400]}
        rootStyles={{ border: "none" }}
      >
        <Menu>
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                {/* TODO: TEMPORARY! SET TO LOGO */}
                <Typography variant="h3" color={colors.grey[100]}>
                  PARA! Manager
                </Typography>
                {/* TODO: TEMPORARY! SET TO LOGO */}

                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              {/* TODO: DON'T FORGET TO SET FALLBACK IMG */}
              <Box display="flex" justifyContent="center" alignItems="center">
                <PersonIcon sx={{fontSize: "50px"}}/>
                {/* <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`../../assets/user.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                /> */}
              </Box>
              {/* TODO: DON'T FORGET TO SET FALLBACK IMG */}
              {/* TODO: DYNAMIC NAMING */}
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Juan Dela Cruz
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  Definitely an admin
                </Typography>
              </Box>
              {/* TODO: DYNAMIC NAMING */}
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<MenuOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
            <Item
              title="Manage Team"
              to="/team"
              icon={<MenuOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Contacts Information"
              to="/contacts"
              icon={<MenuOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Invoices Balances"
              to="/invoices"
              icon={<MenuOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>
            <Item
              title="Profile Form"
              to="/form"
              icon={<MenuOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Calendar"
              to="/calendar"
              icon={<MenuOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQ Page"
              to="/faq"
              icon={<MenuOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Charts
            </Typography>
            <Item
              title="Bar Chart"
              to="/bar"
              icon={<MenuOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Pie Chart"
              to="/pie"
              icon={<MenuOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Line Chart"
              to="/line"
              icon={<MenuOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Geography Chart"
              to="/geography"
              icon={<MenuOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  )
}
