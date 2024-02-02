import { MapContainer } from "react-leaflet"

export const LeafletMap = () => {
  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "100vh" }}
    ></MapContainer>
  )
}
