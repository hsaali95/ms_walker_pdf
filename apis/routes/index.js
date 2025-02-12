var router = require("express").Router();

// Insert routes below
router.use("/users", require("./users"));

module.exports = router;
