const { default: axios } = require("axios");
const moment = require("moment");
const {saveWeather} = require("./mongod");

const liveWeather = async (lat, lon) => {
  try {
    let res = await axios.get(
      `http://api.weatherapi.com/v1/forecast.json?key=${process.env.API_KEY}&q=${lat},${lon}`
    );

    let startDate = moment().startOf("hours").format("X");
    let endDate = moment().startOf("hours").add(10, "hours").format("X");

    let obj = { current: {}, hour: [], location: {} };

    if (res?.data?.location) {
      obj.location = res.data?.location;
    }
      
    if (res?.data?.current) {
      obj.current = res.data?.current;
    } 

    if (res.data?.forecast && res.data?.forecast?.forecastday) {
      obj.hour = [...res.data?.forecast?.forecastday[0].hour]
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
