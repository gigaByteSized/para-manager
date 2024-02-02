import { GridColDef } from "@mui/x-data-grid"

export const defineColums = (data: any) => {
    let columns: GridColDef[] = []
    data.map((column: any) => {

        columns.push({field: column, headerName: column, width: 130})
        // console.log(column)
      })
    return columns
    //   console.log(x.agency.rows)
  }