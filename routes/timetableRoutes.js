const express = require("express");
const router = express.Router();
const controller = require("../controllers/timetableController");
const { authenticateJWT } = require("../middlewares/auth");

router.get("/:studentId", authenticateJWT, controller.getTimetable);

module.exports = router;
