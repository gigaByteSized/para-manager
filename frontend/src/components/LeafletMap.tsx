import L, { LatLngExpression } from "leaflet"
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
  useMapEvents,
} from "react-leaflet"
import customMarkerImg from "../assets/mapMarker.png"
import customMarkerImgInactive from "../assets/mapMarkerInactive.png"
import { useEffect, useMemo, useRef, useState } from "react"
import useSessionStorage from "../hooks/useSessionStorage"

// var polyUtil = require("polyline-encoded");
import polyUtil from "polyline-encoded"

const customMarkerIcon = L.icon({
  iconUrl: customMarkerImg,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
})

const customMarkerIconInactive = L.icon({
  iconUrl: customMarkerImgInactive,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
})

function DraggableMarker(props: any) {
  const [position, setPosition] = useSessionStorage("session-LatLng", props.center)
  const [locateFlag, setLocateFlag] = useState(false)
  // const [draggable, setDraggable] = useState(false)
  const markerRef = useRef(null)

  useEffect(() => {
    if (props.editMode)
      setPosition(props.center)

  }, [props.editMode])

  useEffect(() => {
    const marker = markerRef.current
    if (marker != null) {
      props.callback("stop_lat", marker.getLatLng().lat)
      props.callback("stop_lon", marker.getLatLng().lng)
    }
  }, [])

  const map = useMapEvents({
    click() {
      if (!locateFlag) {
        map.locate()
      }
    },
    locationfound(e) {
      if (!locateFlag) {
        setPosition(e.latlng)
        map.flyTo(e.latlng, map.getZoom())
        props.callback("stop_lat", e.latlng.lat)
        props.callback("stop_lon", e.latlng.lng)
        setLocateFlag(true)
      }
    },
  })

  const eventHandlers = useMemo(
    () => ({
      drag() {
        const marker = markerRef.current
        if (marker != null) {
          setPosition(marker.getLatLng())
          props.callback("stop_lat", marker.getLatLng().lat)
          props.callback("stop_lon", marker.getLatLng().lng)
        }
      },
      dragend() {
        setLocateFlag(true)
      },
    }),
    []
  )
  return (
    <Marker
      autoPan
      autoPanPadding={[100, 100]}
      draggable
      // draggable={draggable}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={customMarkerIcon}
    >
      {/* <Popup minWidth={90}>
        <span onClick={toggleDraggable}>
          {draggable
            ? "Marker is draggable"
            : "Click here to make marker draggable"}
        </span>
      </Popup> */}
    </Marker>
  )
}

function ClickableMarker(props: any) {
  const [position, setPosition] = useState(props.position)

  const checkIfActive = () => {
    var res
    if (props.stop_id) {
      res = props.nodes.some((node) => node[0] === props.stop_id)
    } else {
      res = props.nodes.some(
        (node) => node[0] === position.lng && node[1] === position.lat
      )
    }

    if (res) return true
    else return false
  }

  const [active, setActive] = useState(checkIfActive())
  const markerRef = useRef(null)

  useEffect(() => {
    if (active) {
      props.setNodes((prev) => [
        ...prev,
        props.stop_id
          ? [props.stop_id, [position.lng, position.lat]]
          : [position.lng, position.lat],
      ])
    } else {
      if (props.stop_id) {
        props.setNodes(props.nodes.filter((node) => node[0] !== props.stop_id))
      } else {
        props.setNodes(
          props.nodes.filter(
            (node) => node[0] !== position.lng && node[1] !== position.lat
          )
        )
      }
    }
  }, [active])

  const eventHandlers = useMemo(
    () => ({
      click() {
        setActive(active ? false : true)
        // setActive(active === true ? false : true)
        // console.log(active, "active")
        //   if(active){
        //   props.setNodes((prev) => [...prev, position]);
        //   console.log(props.nodes, "nodes")
        // } else {
        //     props.setNodes(props.nodes.filter((node) => node !== position));
        //   } console.log(props.nodes, "nodes")
      },
    }),
    [active]
  )
  return (
    <Marker
      autoPan
      autoPanPadding={[100, 100]}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={active ? customMarkerIcon : customMarkerIconInactive}
    >
      <Tooltip>{props.tooltip}</Tooltip>
    </Marker>
  )
}

// const MapListener = (props: any) => {
//   const map = useMapEvents({
//     click: () => {
//       map.on("click", function (e) {
//         console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
//       })
//     },
//   })
//   return null
// }

export const LeafletMap = (props: any) => {
  const [position, setPosition] = useSessionStorage("session-LatLng", {
    lat: 14.16462550971221,
    lng: 121.24195218086244,
  })

  // const encoded = `${"omdsA}gqaVx@IQkAIm@[_Ca@oCI{@CgATiBbA}Hx@kGTiBK?J?\yCZoB\cBFYHg@RiANkAt@aHf@_Ch@aCZkATk@L[LYLYXo@KIJHf@iAbAuBtAqC|BuEdAwBpBaEIAH@NYbAqBd@cAnAgCl@mA\o@`C{ELUd@_A`@u@Vw@b@gBJa@Le@ZgAKEJDb@{A|@oDh@{Bd@oBFSPw@FSPw@XgADOH_@??^uADMDODMBGFQRiAz@kC\iAf@yA`@iAXs@f@oAL_@bAaC\u@Xs@JWXq@P]f@iA@CABg@hAQ\Yp@KVYr@]t@y@nBx@oB\u@Xs@JWXq@P]f@iA@CZs@BC`@y@b@}@Zq@l@gA`@y@b@q@Va@OENDt@eAp@cA\e@\k@lAqBNSmDyAiAc@cA[CP|Af@p@VhBt@h@\JFNSt@mAh@}@vA_Cz@uAr@gAFMJO\i@h@{@\m@~@uAvAyBj@w@JMd@m@j@u@KGJFV_@zAuBZa@Za@kDmCqEyBqAm@{AWfAp@jAh@vE~BlBtAx@n@vB~A|C~Ch@b@~A~@xAf@z@R`@JP@IIOKMGg@WOIaAYsAq@gA_Ae@g@_@_@yAoAsB}Av@aAjAoAl@o@x@u@|@}@XWlAaAnA{@LIb@UDCTM`HeDJGzFeDPKRMVOj@_@BCCBk@^WNSLQJPKRMVOj@_@BC`CoBPOFEPOZYPM\[LKPMNKLGn@Md@Gb@KFAf@G`@G`AIzAQr@Kj@I~ASx@Md@GRCn@IRERCz@M\EhDa@PCp@KjAQdAMRCTCb@G~@MTC\GDl@Dx@"}`
  // const encoded = `${"ghrlHir~s@?BIC{ELgDo@aBa@}@I?sB?k@BwD?_JgAJgHt@I@]iHC?B?KuB]oFASg@wImAt@y@f@d@bJ"}`
  // console.log(polyUtil.decode(encoded), "decoded")

  return (
    <>
      <MapContainer
        center={
          props.draggableMarkerPosition
            ? props.draggableMarkerPosition
            : props.position
            ? props.position
            : position
        }
        zoom={props.zoom ? (props.zoom as number) : 14}
        // zoom={14}
        scrollWheelZoom={true}
        style={{ height: props.height ? props.height : 400 }}
        // bounds={props.bounds ? props.bounds : null}
      >
        {/* {props.listen ? <MapListener /> : null} */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxNativeZoom={19}
          maxZoom={20}
          minZoom={4}
        />
        {props.showDraggableMarker ? (
          <DraggableMarker
            callback={props.callback}
            center={
              props.draggableMarkerPosition
                ? props.draggableMarkerPosition
                : position
            }
            setPos={setPosition}
            editMode={props.editMode}
          />
        ) : null}
        {props.showMarkers
          ? props.markers.map((marker, index) => (
              <Marker
                position={marker.position as LatLngExpression}
                key={index}
                icon={customMarkerIcon}
              >
                <Tooltip>{marker.tooltip}</Tooltip>
              </Marker>
            ))
          : null}
        {props.showClickableMarkers
          ? props.markers.map((marker, index) => (
              <ClickableMarker
                position={marker.position as LatLngExpression}
                key={index}
                icon={customMarkerIcon}
                setNodes={props.setNodes}
                nodes={props.nodes}
                tooltip={marker.tooltip}
              />
            ))
          : null}
        {props.mode === "a"
          ? props.markers.map((marker, index) => (
              <ClickableMarker
                position={marker.position as LatLngExpression}
                key={index}
                icon={customMarkerIcon}
                setNodes={props.setAbNodes}
                nodes={props.abNodes}
                tooltip={marker.tooltip}
                stop_id={marker.stop_id}
              />
            ))
          : null}
        {props.mode === "b"
          ? props.markers.map((marker, index) => (
              <ClickableMarker
                position={marker.position as LatLngExpression}
                key={index}
                icon={customMarkerIcon}
                setNodes={props.setBcaNodes}
                nodes={props.bcaNodes}
                tooltip={marker.tooltip}
                stop_id={marker.stop_id}
              />
            ))
          : null}
        {props.mode === "c"
          ? props.markers.map((marker, index) => (
              <ClickableMarker
                position={marker.position as LatLngExpression}
                key={index}
                icon={customMarkerIcon}
                setNodes={props.setAbShapeNodes}
                nodes={props.abShapeNodes}
                tooltip={marker.tooltip}
              />
            ))
          : null}
        {props.mode === "d"
          ? props.markers.map((marker, index) => (
              <ClickableMarker
                position={marker.position as LatLngExpression}
                key={index}
                icon={customMarkerIcon}
                setNodes={props.setBcaShapeNodes}
                nodes={props.bcaShapeNodes}
                tooltip={marker.tooltip}
              />
            ))
          : null}

        {props.showStopMarkersAsInactive
          ? props.markers.map((marker, index) => (
              <Marker
                position={marker.position as LatLngExpression}
                key={index}
                icon={customMarkerIconInactive}
              >
                <Tooltip>{marker.tooltip}</Tooltip>
              </Marker>
            ))
          : null}
        {props.showPolyline ? (
          <Polyline
            pathOptions={{ color: "blue", }} //skyblue
            // positions={polyUtil.decode(encoded)}
            positions={polyUtil.decode(props.encodedPolyline as string)}
          />
        ) : null}
      </MapContainer>
    </>
  )
}
