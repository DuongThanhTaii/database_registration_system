const express = require("express");
const router = express.Router();
const controller = require("../controllers/surveyController");
const { authenticateJWT } = require("../middlewares/auth");

router.post("/submit", authenticateJWT, controller.submitSurvey);
router.get("/my/:studentId", authenticateJWT, controller.viewSurvey);

module.exports = router;
