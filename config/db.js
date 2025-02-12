const mongoose = require("mongoose");

let options = {
  serverSelectionTimeoutMS: 5000,
  maxPoolSize: 10,
};

mongoose.connect(process.env.DBURI, options);

const conn = mongoose.connection;

conn.on("connected", () => {
  console.log("Database connection has been established!");
});
conn.on("reconnected", () => {
  console.log("Database connection has been reconnected!");
});
conn.on("disconnected", () => {
  console.log("Database connection has been disconnected!");
});
conn.on("closed", () => {
  console.log("Database connection has been closed!");
});
conn.on("error", (err) => {
  console.warn("Error in database", err);
});

process.on("exit", function (code) {
  conn.close();
});

process.on("SIGINT", function () {
  conn.close().then(() => process.exit());
});
process.on("SIGQUIT", function () {
  conn.close().then(() => process.exit());
});
process.on("SIGTERM", function () {
  conn.close().then(() => process.exit());
});
