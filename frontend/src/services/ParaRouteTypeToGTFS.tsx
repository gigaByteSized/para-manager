export const ParaRouteTypeToGTFS = (routeType: string): number => {
  const jeepneyIdentifiers = [
    "philippine jeepney",
    "traditional jeepney",
    "traditional jeep",
    "jeepney",
    "jeep",
  ]
  const modernJeepneyIdentifiers = ["modern jeepney"]
  const busIdentifiers = ["bus"]
  const uvExpressIdentifiers = ["uv express", "van"]
  const tricycleIdentifiers = ["tricycle"]

  if (jeepneyIdentifiers.includes(routeType.toLowerCase())) {
    return 3 // GTFS value for Bus
  } else if (modernJeepneyIdentifiers.includes(routeType.toLowerCase())) {
    return 3 // GTFS value for Bus
  } else if (busIdentifiers.includes(routeType.toLowerCase())) {
    return 3 // GTFS value for Bus
  } else if (uvExpressIdentifiers.includes(routeType.toLowerCase())) {
    return 3 // GTFS value for Bus
  } else if (tricycleIdentifiers.includes(routeType.toLowerCase())) {
    return 3 // GTFS value for Bus
  } else {
    return 3 // Default to Bus
  }
}
