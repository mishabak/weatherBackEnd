const { default: axios } = require("axios");
var moment = require("moment-timezone");
const { saveWeather } = require("./mongod");

const liveWeather = async (lat, lon) => {
  try {
    let dtFormat = "YYYY-MM-DD HH:mm";

    let res = await axios.get(
      `http://api.weatherapi.com/v1/forecast.json?key=${process.env.API_KEY}&q=${lat},${lon}`
    );

    let tz = res?.data?.location?.tz_id || "";
    let foreCast = res.data?.forecast?.forecastday[0] || {};

    // initialize response object -->
    let responseObj = {
      hour: [],
      location: res.data?.location || {},
      current: res.data?.current || {},
      sunset: foreCast?.astro?.sunset || "",
    };

    let currentTime = tz
      ? moment().tz(tz).startOf("hours")
      : moment().startOf("hours");

    let formatedDate = currentTime.format(dtFormat);

    if (foreCast?.hour.length > 0) {
      responseObj.hour = foreCast?.hour.filter((data, idx) => {
        // add flag for current hour -->>
        if (formatedDate == data.time) {
          data.now = true;
        }

        // filter 10 hours from last to first -->>
        if (formatedDate.split(" ")[1] >= "15:00") {
          if (idx >= 14) {
            return data;
          }
        } else {
          // filter 10 hours from start -->>
          if (formatedDate <= data.time) {
            return data;
          }
        }
      });
    }

    responseObj.hour = responseObj.hour.slice(0, 10);

    // create new document if it's not exist.
    await saveWeather(res.data);
    return responseObj;
  } catch (error) {
    throw error;
  }
};

module.exports = liveWeather;
