var express = require("express");
var cors = require("cors");
var app = express();
app.use(express.static("public"));
app.use(cors());
// Increase payload size limit
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

module.exports = app;
