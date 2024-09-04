const { default: axios } = require("axios");
const moment = require("moment");
const { saveWeather } = require("./mongod");

const liveWeather = async (lat, lon) => {
  try {
    let res = await axios.get(
      `http://api.weatherapi.com/v1/forecast.json?key=${process.env.API_KEY}&q=${lat},${lon}`
    );

    let startDate = moment().startOf("hours").format("X");
    let endDate = moment().startOf("hours").add(10, "hours").format("X");
    let foreCast = res.data?.forecast?.forecastday[0] || {};
    let obj = { hour: [] };

    obj.location = res.data?.location || {};
    obj.current = res.data?.current || {};
    obj.sunset = foreCast?.astro?.sunset || "";

    if (res.data?.forecast && res.data?.forecast?.forecastday) {
      obj.hour = [...res.data?.forecast?.forecastday[0].hour];
      obj.hour = obj.hour.filter(
        (e) => e.time_epoch >= startDate && e.time_epoch <= endDate
      );
    }
    await saveWeather(res.data);
    return obj;
  } catch (error) {
    throw error;
  }
};

module.exports = liveWeather;
