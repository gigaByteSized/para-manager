import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase-config"
import { ParaRouteTypeToGTFS } from "../services/ParaRouteTypeToGTFS"
import JSZip from "jszip"

export const exportGtfsData = async () => {
  const fetchCollectionData = async (collectionName: string) => {
    const collectionRef = collection(db, collectionName)
    const snapshot = await getDocs(collectionRef)
    return snapshot.docs.map((doc) => doc.data())
  }

  const convertToCsv = (data: any[], headers: string[]) => {
    const csvRows = [headers.join(",")]
    data.forEach((row) => {
      const values = headers.map((header) => row[header] || "")
      csvRows.push(values.join(","))
    })
    return csvRows.join("\n")
  }

  const downloadZipFile = (zipContent: Blob, fileName: string) => {
    const a = document.createElement("a")
    a.href = URL.createObjectURL(zipContent)
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const generateTxt = (data: any[], headers: string[], transform?: (item: any) => any[]) => {
    const rows = data.map((item) => transform ? transform(item) : headers.map((header) => item[header] || ""))
    return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
  }

  // Fetch all required collections
  const stops = await fetchCollectionData("stops")
  const routes = await fetchCollectionData("routes")
  const shapes = await fetchCollectionData("shapes")
  const stopTimes = await fetchCollectionData("stop_times")
  const frequencies = await fetchCollectionData("frequencies")
  const trips = await fetchCollectionData("trips")
  const agencies = await fetchCollectionData("agency")
  const calendars = await fetchCollectionData("calendar")

  // Generate txt content for each file
  const stopsHeaders = [
    "stop_id", "stop_name", "stop_desc", "stop_lat", "stop_lon", "zone_id", "stop_url", 
    "location_type", "parent_station", "stop_timezone", "wheelchair_boarding"
  ]
  const stopsTxt = generateTxt(stops, stopsHeaders, (stop) => [
    stop.stop_id || "", stop.stop_name || "", stop.stop_desc || "", 
    stop.stop_lat !== undefined ? stop.stop_lat.toString() : "", 
    stop.stop_lon !== undefined ? stop.stop_lon.toString() : "", 
    "", "", "", "", "", ""
  ])

  const routesHeaders = [
    "route_id", "agency_id", "route_short_name", "route_long_name", "route_desc", 
    "route_type", "route_url", "route_color", "route_text_color"
  ]
  const routesTxt = generateTxt(routes, routesHeaders, (route) => [
    route.route_id || "", route.agency_id || "", route.route_short_name || "", 
    route.route_long_name || "", route.route_desc || "", 
    ParaRouteTypeToGTFS(route.route_type).toString(), route.route_url || "", 
    route.route_color || "", route.route_text_color || ""
  ])

  const agencyHeaders = [
    "agency_id", "agency_name", "agency_url", "agency_timezone", "agency_lang", "agency_phone", "agency_fare_url"
  ]
  const agencyTxt = generateTxt(agencies, agencyHeaders)

  const calendarHeaders = [
    "service_id", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "start_date", "end_date"
  ]
  const formatDate = (date: string) => {
    const [year, month, day] = date.split("-")
    return `${year}${month}${day}`
  }
  const calendarTxt = generateTxt(calendars, calendarHeaders, (calendar) => [
    calendar.service_id || "",
    calendar.monday || "",
    calendar.tuesday || "",
    calendar.wednesday || "",
    calendar.thursday || "",
    calendar.friday || "",
    calendar.saturday || "",
    calendar.sunday || "",
    formatDate(calendar.start_date),
    formatDate(calendar.end_date)
  ])

  const shapesHeaders = ["shape_id", "shape_pt_lat", "shape_pt_lon", "shape_pt_sequence"]
  const shapesTxt = convertToCsv(shapes, shapesHeaders)

  const stopTimesHeaders = ["trip_id", "arrival_time", "departure_time", "stop_id", "stop_sequence"]
  const stopTimesTxt = convertToCsv(stopTimes, stopTimesHeaders)

  const frequenciesHeaders = ["trip_id", "start_time", "end_time", "headway_secs"]
  const frequenciesTxt = convertToCsv(frequencies, frequenciesHeaders)

  const tripsHeaders = ["route_id", "service_id", "trip_id", "shape_id"]
  const tripsTxt = convertToCsv(trips, tripsHeaders)

  // Create a zip file with all the txt files
  const zip = new JSZip()
  zip.file("stops.txt", stopsTxt)
  zip.file("routes.txt", routesTxt)
  zip.file("agency.txt", agencyTxt)
  zip.file("calendar.txt", calendarTxt)
  zip.file("shapes.txt", shapesTxt)
  zip.file("stop_times.txt", stopTimesTxt)
  zip.file("frequencies.txt", frequenciesTxt)
  zip.file("trips.txt", tripsTxt)

  const zipContent = await zip.generateAsync({ type: "blob" })
  downloadZipFile(zipContent, "gtfs.zip")
}
