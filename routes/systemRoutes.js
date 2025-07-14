const express = require("express");
const router = express.Router();
const systemController = require("../controllers/systemController");

router.post("/close-survey", systemController.closeSurvey);

module.exports = router;
