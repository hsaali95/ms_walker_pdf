const dotenv = require("dotenv");
dotenv.config({ path: `.env` });
const helper = require("./helper/helper");
const http = require("http");
const app = require("./config/express");
var server = http.createServer(app);
const port = process.env.PORT || 3001;

//require database service to connect db
// require("./config/db");

app.use("/api/v1", require("./apis/routes/index"));

app.get("/working", (req, res) => {
  res.send("The app is working!");
});

server.listen(port, () => {
  helper.serverStartLog(port);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1); // Exit to prevent an unstable state
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
