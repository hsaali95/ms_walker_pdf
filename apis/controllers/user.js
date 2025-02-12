const helper = require("../../helper/helper");
const repository = require("../../repository/respository");
const models = require("../models");

const getUsers = async (req, res) => {
  try {
    let data = await repository.get(models.users, {}, false);
    res.status(200).send(helper.sucessResponse(data));
  } catch (e) {
    res.send(e);
  }
};
const aboutUsers = (req, res) => {
  try {
    res.send("This the about user page");
  } catch (e) {
    res.send(e);
  }
};

module.exports = {
  getUsers: getUsers,
  aboutUsers: aboutUsers,
};
