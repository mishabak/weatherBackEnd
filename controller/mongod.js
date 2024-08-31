const { selectedWeather } = require("../schema/weatherModel");
const moment = require("moment");
const saveWeather = async (arg) => {
  try {
    if (!arg?.location?.region) {
      throw new Error("Location region is required");
    }

    let date = moment(arg?.location?.localtime).format("YYYY-MM-DD");
    let query = {
      "location.region": arg.location.region,
      localDate: date,
    };

    await selectedWeather.findOneAndUpdate(
      query,
      { ...arg, localDate: date },
      {
        new: true,
        upsert: true,
      }
    );
  } catch (error) {
    console.log(error, "create Error");
    throw error;
  }
};

const filterFromDb = async (startDate, endDate, country) => {
  try {
    let location = country ? { "location.country": country } : {};
    let dateFilter = {};

    // if search field is not there then find last 10 doc 

    if (startDate && endDate) {
      dateFilter = {
        localDate: {
          $gte: startDate,
          $lte: endDate,
        },
      };
    }

    const pipeline = [
      {
        $match: {
          ...location,
          ...dateFilter,
        },
      },
      {
        $sort: { updatedAt: -1 },
      },
      ...(startDate && endDate ? [] : [{ $limit: 10 }]),
    ];

    let response = await selectedWeather.aggregate(pipeline);
    return response;
  } catch (error) {
    console.log(error, "find Error");
  }
};

module.exports = { saveWeather, filterFromDb };
