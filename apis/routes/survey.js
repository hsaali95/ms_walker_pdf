const survey = require("../controllers/survey");
var router = require("express").Router();

router.post("/survey-pdf", survey.generatePdf);

module.exports = router;
