const express = require("express")
const axios = require("axios")
const router = express.Router()

router.post("/geocoder", async (req, res) => {
  const { query } = req.body
  if (!query) {
    return res.status(400).json({ error: "Invalid query" })
  }

  try {
    const response = await axios.get(
      `https://api.openrouteservice.org/geocode/search?api_key=${process.env.API_KEY}&text=${query}`
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
