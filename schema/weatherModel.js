let mongoose = require("mongoose");
let selectedWeather = new mongoose.Schema(
  {
    current: Object,
    forecast: Object,
    location: Object,
    localDate:String
  },
  { timestamps: true }
);

module.exports.selectedWeather = mongoose.model(
  "selectedWeather",
  selectedWeather
);
