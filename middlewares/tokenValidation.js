const helper = require("../helper/helper");

exports.tokenValidation = (req, res, next) => {
  if (false) {
    return res
      .status(401)
      .send(helper.errorResponse(helper.statusMessages.unauthorized));
  }
  next();
};
