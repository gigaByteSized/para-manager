import * as yup from "yup"

export const routeTypes = {
  0: "Tram",
  1: "Subway",
  2: "Rail",
  3: "Bus",
  4: "Ferry",
  5: "Cable car",
  6: "Gondola",
  7: "Funicular",
  100: "Railway Service",
  101: "High Speed Rail Service",
  102: "Long Distance Trains",
  103: "Inter Regional Rail Service",
  104: "Car Transport Rail Service",
  105: "Sleeper Rail Service",
  106: "Regional Rail Service",
  107: "Tourist Railway Service",
  108: "Rail Shuttle (Within Complex)",
  109: "Suburban Railway",
  110: "Replacement Rail Service",
  111: "Special Rail Service",
  112: "Lorry Transport Rail Service",
  113: "All Rail Services",
  114: "Cross-Country Rail Service",
  115: "Vehicle Transport Rail Service",
  116: "Rack and Pinion Railway",
  117: "Additional Rail Service",
  200: "Coach Service",
  201: "International Coach Service",
  202: "National Coach Service",
  203: "Shuttle Coach Service",
  204: "Regional Coach Service",
  205: "Special Coach Service",
  206: "Sightseeing Coach Service",
  207: "Tourist Coach Service",
  208: "Commuter Coach Service",
  209: "All Coach Services",
  300: "Suburban Railway Service",
  400: "Urban Railway Service",
  401: "Metro Service",
  402: "Underground Service",
  403: "Urban Railway Service",
  404: "All Urban Railway Services",
  405: "Monorail",
  500: "Metro Service",
  600: "Underground Service",
  700: "Bus Service",
  701: "Regional Bus Service",
  702: "Express Bus Service",
  703: "Stopping Bus Service",
  704: "Local Bus Service",
  705: "Night Bus Service",
  706: "Post Bus Service",
  707: "Special Needs Bus",
  708: "Mobility Bus Service",
  709: "Mobility Bus for Registered Disabled",
  710: "Sightseeing Bus",
  711: "Shuttle Bus",
  712: "School Bus",
  713: "School and Public Service Bus",
  714: "Rail Replacement Bus Service",
  715: "Demand and Response Bus Service",
  716: "All Bus Services",
  800: "Trolleybus Service",
  900: "Tram Service",
  901: "City Tram Service",
  902: "Local Tram Service",
  903: "Regional Tram Service",
  904: "Sightseeing Tram Service",
  905: "Shuttle Tram Service",
  906: "All Tram Services",
  1000: "Water Transport Service",
  1001: "International Car Ferry Service",
  1002: "National Car Ferry Service",
  1003: "Regional Car Ferry Service",
  1004: "Local Car Ferry Service",
  1005: "International Passenger Ferry Service",
  1006: "National Passenger Ferry Service",
  1007: "Regional Passenger Ferry Service",
  1008: "Local Passenger Ferry Service",
  1009: "Post Boat Service",
  1010: "Train Ferry Service",
  1011: "Road-Link Ferry Service",
  1012: "Airport-Link Ferry Service",
  1013: "Car High-Speed Ferry Service",
  1014: "Passenger High-Speed Ferry Service",
  1015: "Sightseeing Boat Service",
  1016: "School Boat",
  1017: "Cable-Drawn Boat Service",
  1018: "River Bus Service",
  1019: "Scheduled Ferry Service",
  1020: "Shuttle Ferry Service",
  1021: "All Water Transport Services",
  1100: "Air Service",
  1101: "International Air Service",
  1102: "Domestic Air Service",
  1103: "Intercontinental Air Service",
  1104: "Domestic Scheduled Air Service",
  1105: "Shuttle Air Service",
  1106: "Intercontinental Charter Air Service",
  1107: "International Charter Air Service",
  1108: "Round-Trip Charter Air Service",
  1109: "Sightseeing Air Service",
  1110: "Helicopter Air Service",
  1111: "Domestic Charter Air Service",
  1112: "Schengen-Area Air Service",
  1113: "Airship Service",
  1114: "All Air Services",
  1200: "Ferry Service",
  1300: "Telecabin Service",
  1301: "Telecabin Service",
  1302: "Cable Car Service",
  1303: "Elevator Service",
  1304: "Chair Lift Service",
  1305: "Drag Lift Service",
  1306: "Small Telecabin Service",
  1307: "All Telecabin Services",
  1400: "Funicular Service",
  1401: "Funicular Service",
  1402: "All Funicular Service",
  1500: "Taxi Service",
  1501: "Communal Taxi Service",
  1502: "Water Taxi Service",
  1503: "Rail Taxi Service",
  1504: "Bike Taxi Service",
  1505: "Licensed Taxi Service",
  1506: "Private Hire Service Vehicle",
  1507: "All Taxi Services",
  1600: "Self Drive",
  1601: "Hire Car",
  1602: "Hire Van",
  1603: "Hire Motorbike",
  1604: "Hire Cycle",
  1700: "Miscellaneous Service",
  1701: "Cable Car",
  1702: "Horse-drawn Carriage",
  1945: "Philippine Jeepney",
  2000: "Tricycle",
  2001: "Habal-Habal",
  2016: "Van",
  2017: "Modern Jeepney",
}

export const agencySchema = yup.lazy((values) => {
  const {
    agency_id,
    agency_name,
    agency_url,
    agency_timezone,
    agency_lang,
    agency_phone,
    agency_fare_url,
    agency_email,
  } = values

  if (!agency_id || !agency_name || !agency_url || !agency_timezone) {
    return yup.object().shape({
      agency_id: yup.string().required("Agency ID is required"),
      agency_name: yup.string().required("Agency name is required"),
      agency_url: yup.string().required("Agency URL is required"),
      agency_timezone: yup.string().required("Agency timezone is required"),
    })
  }
  return yup.mixed().notRequired()
})

export const stopSchema = yup.lazy((values) => {
  const { stop_name, stop_lat, stop_lng, stop_id } = values

  if (!stop_name || !stop_lat || !stop_lon) {
    return yup.object().shape({
      stop_name: yup.string().required("Stop name is required"),
      stop_lat: yup.string().required("Stop latitude is required, click on the map to set the latitude"),
      stop_lon: yup.string().required("Stop longitude is required, click on the map to set the longitude"),
    })
  }

  return yup.mixed().notRequired()
})

export const routeSchema = yup.lazy((values) => {
  const { route_short_name, route_long_name, route_type, agency_id } = values
  if (!route_short_name && !route_long_name) {
    return yup.object().shape({
      route_short_name: yup
        .string()
        .required("Short name is required if long name is not provided"),
      route_long_name: yup
        .string()
        .required("Long name is required if short name is not provided"),
      route_type: yup.string().required("Route type is required"),
      agency_id: yup.string().required("Agency ID is required"),
    })
  }
  if (!route_type) {
    return yup.object().shape({
      route_type: yup.string().required("Route type is required"),
    })
  }
  if (!agency_id) {
    return yup.object().shape({
      agency_id: yup.string().required("Agency ID is required"),
    })
  }
  return yup.mixed().notRequired()
})

export const calendarSchema = yup.lazy((values) => {
  const { service_id, start_date, end_date } = values
  if (!service_id || !start_date || !end_date) {
    return yup.object().shape({
      service_id: yup.string().required("Service ID is required"),
      start_date: yup.string().required("Start date is required"),
      end_date: yup.string().required("End date is required"),
    })
  }
  return yup.mixed().notRequired()
})

// trip schema combines trips and frequencies
export const tripSchema = yup.lazy((values) => {
  const { route_id, service_id, trip_id, start_time, end_time  } = values
  if (!route_id || !service_id || !trip_id || !start_time || !end_time) {
    return yup.object().shape({
      route_id: yup.string().required("Route ID is required"),
      service_id: yup.string().required("Service ID is required"),
      trip_id: yup.string().required("Trip ID is required"),
      start_time: yup.string().required("Start time is required"),
      end_time: yup.string().required("End time is required"),
    })
  }
  return yup.mixed().notRequired()
})

// export const routeSchema = yup.object().shape({
//     // routeLongName: yup.string().ensure().required("Long name is required"),
//   routeLongName: yup.string().ensure().when("routeShortName", {
//     is: '',
//     then: yup
//       .string()
//       .required("Short name is required if long name is not provided"),
//     // otherwise: yup.string().nullable(),
//   }),
//   routeShortName: yup.string().ensure().required("Short name is required"),

// //   routeShortName: yup.string().ensure().when("routeLongName", {
// //     is: '',() => editUser(row.id)
// //   }),
// },[['routeShortName', 'routeLongName']]);
