import { useState, useEffect } from "react";

export const getCurrentPosition = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation not supported");
    }
  }, []);

  function success(position: { coords: { latitude: any; longitude: any } }) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLocation({ latitude, longitude });
  }

  function error() {
    console.log("Unable to retrieve your location");
  }

  if (
    location.latitude !== null &&
    location.longitude !== null &&
    location !== undefined
  ) {
    return location;
  }
};
