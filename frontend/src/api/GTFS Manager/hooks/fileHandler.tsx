import { ChangeEvent } from "react"
import JSZip from "jszip"
import Papa from "papaparse"

import * as Schema from "../schema"
import { defineColums } from "./defineColumns"

const handleZip = async (f: File) => {
  let data: { [key: string]: Object } = {}

  try {
    const zipData = await JSZip.loadAsync(f)
    const zipFiles = Object.keys(zipData.files)

    // Sanitize files, remove any files that are not in the schema
    const requiredFiles = zipFiles.filter((filename) =>
      Schema.filenameSchemaRequired.includes(filename)
    ) //Object.values(Schema.filenameSchemaRequired)

    // Return an error if any required files are missing
    // Chore: return error
    // Chore: decide if error will be returned as an additional prop after all files are accepted
    if (requiredFiles.length !== Schema.filenameSchemaRequired.length) {
      console.error("Missing required files:", requiredFiles)

      // TODO: return error
      return
    }

    const optionalFiles = zipFiles.filter((filename) =>
      Schema.filenameSchemaAll.includes(filename)
    )

    // Get all files from set union of required and optional files
    const files = Array.from(new Set(requiredFiles.concat(optionalFiles)))

    await Promise.all(
      files.map(async (fileName) => {
        const text = await zipData.file(fileName)?.async("text")

        return new Promise<void>((resolve) => {
          // Parse CSV data using PapaParse
          Papa.parse(text!, {
            header: true, // Set to true if your CSV has a header row
            dynamicTyping: true, // Automatically parse numbers and booleans
            skipEmptyLines: true, // Ignore empty lines
            complete: (result) => {
              // Chore: validate data against schema using yup
              data[fileName.slice(0, -4)] = result.data

              resolve()
            },
            error: (error: { message: any }) => {
              console.error(
                `Error parsing CSV from ${fileName}:`,
                error.message
              )
              resolve()
            },
          })
        })
      })
    )

    console.log(data)
    return data
  } catch (error) {
    // TODO: catch error
    console.error("Error reading zip file:", error)
  }
}

// Upload zip file and parse CSV data
export const handleUpload = async (
  e: ChangeEvent<HTMLInputElement>,
  handleColumnsUpdate: any,
  handleRowsUpdate: any
) => {
  // Check if files were uploaded
  if (!e.target.files) {
    return
  }
  const file = e.target.files[0]

  const transformData = (data: any) => {
    let objects: {
      [key: string]: { columns: Object[]; rows: Object[] }
    } = {}
    Object.keys(data).map((key) => {
      // for (let i = 0; i < data[key].length; i++) {
      //   console.log(Object.values(data[key][i]))

      // }

      objects[key] = {
        columns: Object.keys(data[key][0]), // Assuming the first row represents columns
        rows: data[key],
      }

    })
    return objects
  }

  // { field: 'id', headerName: 'ID', width: 70 },
  // { field: 'firstName', headerName: 'First name', width: 130 },
  // { field: 'lastName', headerName: 'Last name', width: 130 },
  // {
  //   field: 'age',
  //   headerName: 'Age',
  //   type: 'number',
  //   width: 90,
  // },
  // {
  //   field: 'fullName',
  //   headerName: 'Full name',
  //   description: 'This column has a value getter and is not sortable.',
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (params: GridValueGetterParams) =>
  //     `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  // },

  try {
    // Parse zip file
    let data = await handleZip(file)

    let x = transformData(data)
    // console.log(x.agency.columns)
    console.log(x.agency.rows)

    // handleColumnsUpdate(x.agency.columns)
    handleColumnsUpdate(defineColums(x.routes.columns))
    handleRowsUpdate(x.routes.rows)
    // handleRowsUpdate(rowsWithId)

    console.log(x)
  } catch (error) {
    // TODO: catch error
    console.error("Error handling upload:", error)
  }
}
