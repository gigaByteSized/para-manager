const apiKey = require("../.secrets").apiKey
const express = require("express")
const axios = require("axios")
const router = express.Router()

router.post("/directions", async (req, res) => {
  const { coordinates } = req.body

  if (!coordinates || !Array.isArray(coordinates)) {
    return res.status(400).json({ error: "Invalid coordinates format" })
  }
  
  try {
    const response = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car",
      { coordinates, continue_straight: "true" },
      {
        headers: {
          Accept:
            "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
          Authorization: apiKey,
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    )

    res.status(response.status).json(response.data)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      res
        .status(error.response?.status || 500)
        .json(error.response?.data || { error: "An error occurred" })
    } else {
      res.status(500).json({ error: "An error occurred" })
    }
  }
})

module.exports = router
