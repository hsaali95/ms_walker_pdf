const mongoose = require("mongoose");

const schema = new mongoose.Schema({
//   _id: mongoose.Types.ObjectId,
  name: String,
  username: String,
});

module.exports = mongoose.model("users", schema);
