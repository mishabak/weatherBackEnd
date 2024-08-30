const weather = require('./router/weather');
const connectDB = require('./helper/db');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// connect database -->>
connectDB()

// weather api base route -->>
app.use("/api/weather",weather)


//  connect server -->>
const PORT = process.env.PORT || 8006;
app.listen(PORT, () => console.log(`Server running on port ${PORT}🔥`));
