const helper = require("./helper/helper");
const http = require("http");
const dotenv = require("dotenv");
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const app = require("./config/express");
var server = http.createServer(app);
const port = process.env.PORT || 3000;

//require database service to connect db
require("./config/db");


app.use("/api/v1", require("./apis/routes/index"));

app.get("/working", (req, res) => {
  res.send("The app is working!");
});

server.listen(port, () => {
  helper.serverStartLog(port);
});
