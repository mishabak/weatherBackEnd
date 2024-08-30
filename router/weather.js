const express = require("express");
const app = express();

app.get("/search", (req, res) => {
  res.json({ success: true, message: "successFully find weather details" });
});

app.get("/current", (req, res) => {
  res.json({ success: true, message: "successFully find weather details" });
});
module.exports = app;
