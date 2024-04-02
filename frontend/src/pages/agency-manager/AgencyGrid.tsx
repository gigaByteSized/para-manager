import { Box, Button, useTheme } from "@mui/material"
import DomainAddOutlinedIcon from "@mui/icons-material/DomainAddOutlined"
import mockAgencies from "../../mockdata/mockAgency"

import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid"
import { tokens } from "../../theme"

// const columns: GridColDef[] = [
//   { field: "id", headerName: "ID", width: 90 },
//   {
//     field: "firstName",
//     headerName: "First name",
//     width: 150,
//     editable: true,
//   },
//   {
//     field: "lastName",
//     headerName: "Last name",
//     width: 150,
//     editable: true,
//   },
//   {
//     field: "age",
//     headerName: "Age",
//     type: "number",
//     width: 110,
//     editable: true,
//   },
//   {
//     field: "fullName",
//     headerName: "Full name",
//     description: "This column has a value getter and is not sortable.",
//     sortable: false,
//     width: 160,
//     valueGetter: (params: GridValueGetterParams) =>
//       `${params.row.firstName || ""} ${params.row.lastName || ""}`,
//   },
// ]

const columns: GridColDef[] = [
  { field: "agency_id", headerName: "Agency ID", width: 90 },
  {
    field: "agency_name",
    headerName: "Agency Name",
    flex: 1,
    // editable: true,
  },
  {
    field: "agency_url",
    headerName: "Agency URL",
    flex: 1,
    // editable: true,
  },
  {
    field: "agency_timezone",
    headerName: "Agency Timezone",
    // type: "number",
    width: 90,
    // editable: true,
  },
  {
    field: "agency_lang",
    headerName: "Language",
    // type: "number",
    width: 90,
    // editable: true,
  },
  {
    field: "agency_phone",
    headerName: "Contact Number",
    // type: "number",
    flex: 1,
    // editable: true,
  },
  {
    field: "agency_fare_url",
    headerName: "Fare URL",
    // type: "number",
    width: 110,
    // editable: true,
  },
  {
    field: "agency_email",
    headerName: "Agency Email",
    // type: "number",
    width: 110,
    editable: true,
  },
  // {
  //   field: "fullName",
  //   headerName: "Full name",
  //   description: "This column has a value getter and is not sortable.",
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (params: GridValueGetterParams) =>
  //     `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  // },
]

// const rows = [
//   { id: 1, lastName: "Snow", firstName: "Jon", age: 14 },
//   { id: 2, lastName: "Lannister", firstName: "Cersei", age: 31 },
//   { id: 3, lastName: "Lannister", firstName: "Jaime", age: 31 },
//   { id: 4, lastName: "Stark", firstName: "Arya", age: 11 },
//   { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
//   { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
//   { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
//   { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
//   { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
// ]

const QuickSearchToolbar = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  return (
    <Box
      sx={{
        display: "flex",
        p: 0.5,
        pb: 1,
        justifyContent: "space-between",
        // alignContent:"center"
      }}
    >
      <Button
        variant="contained"
        href="agency/wizard"
        endIcon={<DomainAddOutlinedIcon />}
        sx={{
          backgroundColor: colors.greenAccent[600],
          color: colors.grey[100],
          "&:hover": {
            backgroundColor: colors.greenAccent[800],
          },
        }}
      >
        Add Agency
      </Button>
      <GridToolbarQuickFilter />
    </Box>
  )
}

export const AgencyGrid = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  return (
    <Box
      sx={{
        height: "60vh",
        width: "100%",
        "& .MuiDataGrid-root": {
          border: "none",
        },
        "& .MuiDataGrid-cell": {
          borderBottom: "none",
        },
        "& .name-column--cell": {
          color: colors.greenAccent[300],
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: colors.blueAccent[700],
          borderBottom: "none",
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: colors.primary[400],
        },
        "& .MuiDataGrid-footerContainer": {
          borderTop: "none",
          backgroundColor: colors.blueAccent[700],
        },
        "& .MuiCheckbox-root": {
          color: `${colors.greenAccent[200]} !important`,
        },
      }}
    >
      <DataGrid
        rows={mockAgencies}
        columns={columns}
        getRowId={(row) => row.agency_id}
        // initialState={{
        //   pagination: {
        //     paginationModel: {
        //       pageSize: 5,
        //     },
        //   },
        // }}
        // pageSizeOptions={[5]}
        slots={{ toolbar: QuickSearchToolbar }}
        checkboxSelection
        disableRowSelectionOnClick
        // disableColumnFilter
        // disableColumnSelector
        // disableDensitySelector
      />
    </Box>
  )
}
