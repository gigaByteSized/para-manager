import * as Yup from "yup"

export const filenameSchemaAll = [
  "agency.txt",
  "stops.txt",
  "routes.txt",
  "trips.txt",
  "stop_times.txt",
  "calendar.txt",
  "calendar_dates.txt",
  "fare_attributes.txt",
  "fare_rules.txt",
  "timeframes.txt",
  "fare_media.txt",
  "fare_products.txt",
  "fare_leg_rules.txt",
  "fare_transfer_rules.txt",
  "areas.txt",
  "stop_areas.txt",
  "networks.txt",
  "route_networks.txt",
  "shapes.txt",
  "frequencies.txt",
  "transfers.txt",
  "pathways.txt",
  "levels.txt",
  "translations.txt",
  "feed_info.txt",
  "attributions.txt",
]

export const filenameSchemaRequired = [
  "agency.txt",
  "stops.txt",
  "routes.txt",
  "trips.txt",
  "stop_times.txt",
]

// export const fileSchema = Yup.object().shape({
//   agency: Yup.string()
//     .matches(/agency.txt/)
//     .required(),
//   stops: Yup.string()
//     .matches(/stops.txt/)
//     .required(),
//   routes: Yup.string()
//     .matches(/routes.txt/)
//     .required(),
//   trips: Yup.string()
//     .matches(/trips.txt/)
//     .required(),
//   stop_times: Yup.string()
//     .matches(/stop_times.txt/)
//     .required(),
//   calendar: Yup.string().matches(/calendar.txt/), // Conditionally Required
//   calendar_dates: Yup.string().matches(/calendar_dates.txt/), // Conditionally Required
//   fare_attributes: Yup.string().matches(/fare_attributes.txt/),
//   fare_rules: Yup.string().matches(/fare_rules.txt/),
//   timeframes: Yup.string().matches(/timeframes.txt/),
//   fare_media: Yup.string().matches(/fare_media.txt/),
//   fare_products: Yup.string().matches(/fare_products.txt/),
//   fare_leg_rules: Yup.string().matches(/fare_leg_rules.txt/),
//   fare_transfer_rules: Yup.string().matches(/fare_transfer_rules.txt/),
//   areas: Yup.string().matches(/areas.txt/),
//   stop_areas: Yup.string().matches(/stop_areas.txt/),
//   networks: Yup.string().matches(/networks.txt/), // Conditionally Forbidden
//   route_networks: Yup.string().matches(/route_networks.txt/), // Conditionally Forbidden
//   shapes: Yup.string().matches(/shapes.txt/),
//   frequencies: Yup.string().matches(/frequencies.txt/),
//   transfers: Yup.string().matches(/transfers.txt/),
//   pathways: Yup.string().matches(/pathways.txt/),
//   levels: Yup.string().matches(/levels.txt/), // Conditionally Required
//   translations: Yup.string().matches(/translations.txt/),
//   feed_info: Yup.string().matches(/feed_info.txt/),
//   attributions: Yup.string().matches(/attributions.txt/),
// })

// const agencyFile = Yup.string().matches(/agency.txt/).required()
// const stopsFile = Yup.string().matches(/stops.txt/).required()
// const routesFile = Yup.string().matches(/routes.txt/).required()
// const tripsFile = Yup.string().matches(/trips.txt/).required()
// const stopTimesFile = Yup.string().matches(/stop_times.txt/).required()
// const calendarFile = Yup.string().matches(/calendar.txt/)
// const calendarDatesFile = Yup.string().matches(/calendar_dates.txt/)
// const fareAttributesFile = Yup.string().matches(/fare_attributes.txt/)
// const fareRulesFile = Yup.string().matches(/fare_rules.txt/)
// const timeframesFile = Yup.string().matches(/timeframes.txt/)
// const fareMediaFile = Yup.string().matches(/fare_media.txt/)
// const fareProductsFile = Yup.string().matches(/fare_products.txt/)
// const fareLegRulesFile = Yup.string().matches(/fare_leg_rules.txt/)
// const fareTransferRulesFile = Yup.string().matches(/fare_transfer_rules.txt/)
// const areasFile = Yup.string().matches(/areas.txt/)
// const stopAreasFile = Yup.string().matches(/stop_areas.txt/)
// const networksFile = Yup.string().matches(/networks.txt/)
// const routeNetworksFile = Yup.string().matches(/route_networks.txt/)
// const shapesFile = Yup.string().matches(/shapes.txt/)
// const frequenciesFile = Yup.string().matches(/frequencies.txt/)
// const transfersFile = Yup.string().matches(/transfers.txt/)
// const pathwaysFile = Yup.string().matches(/pathways.txt/)
// const levelsFile = Yup.string().matches(/levels.txt/)
// const translationsFile = Yup.string().matches(/translations.txt/)
// const feedInfoFile = Yup.string().matches(/feed_info.txt/)
// const attributionsFile = Yup.string().matches(/attributions.txt/)

// export const fsSchema = Yup.array().of(
//     agencyFile,
//     stopsFile,

//     )
