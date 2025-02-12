const user = require("../controllers/user");
const { tokenValidation } = require("../../middlewares/tokenValidation");
var router = require("express").Router();

router.get("/", tokenValidation, user.getUsers);

module.exports = router;
