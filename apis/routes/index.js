var router = require("express").Router();

// Insert routes below
router.use("/users", require("./users"));
router.use("/survey", require("./survey"));

module.exports = router;
