export const ShortenRouteType = (routeType: string) => {
  console.log(routeType)
  console.log(routeType.toLowerCase())

  // Cases
  const jeepneyIdentifiers = [
    "philippine jeepney",
    "traditional jeepney",
    "traditional jeep",
    "jeepney",
    "jeep"
  ]
  const modernJeepneyIdentifiers = ["modern jeepney"]
  const busIdentifiers = ["bus"]
  const uvExpressIdentifiers = ["uv express", "van"]
  const tricycleIdentifiers = ["tricycle"]

  if (jeepneyIdentifiers.includes(routeType.toLowerCase())) {
    return "PUJ"
  } else if (modernJeepneyIdentifiers.includes(routeType.toLowerCase())) {
    return "MPUJ"
  } else if (busIdentifiers.includes(routeType.toLowerCase())) {
    return "PUB"
  } else if (uvExpressIdentifiers.includes(routeType.toLowerCase())) {
    return "PUV"
  } else if (tricycleIdentifiers.includes(routeType.toLowerCase())) {
    return "TRIKE"
  }
}
