const express = require("express");
const liveWeather = require("../controller/liveWeather");
const { filterFromDb } = require("../controller/mongod");
const app = express();

app.get("/", async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    if (latitude && longitude) {
      let response = await liveWeather(latitude, longitude);

      return res.status(200).json({
        success: true,
        result: response,
        message: "successFully find weather details",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "latitude and logitude are required field",
      });
    }
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, error: error, message: "weather api failed" });
  }
});

app.get("/search", async (req, res) => {
  try {
    const { startDate, endDate, country } = req.query;
    let response = await filterFromDb(startDate, endDate, country);

    return res.status(200).json({
      success: true,
      result: response,
      message: "successFully find details",
    });
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, error: error, message: "search api failed" });
  }
});

module.exports = app;
