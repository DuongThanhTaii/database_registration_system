const express = require("express");
const router = express.Router();
const controller = require("../controllers/adminController");
const { authenticateJWT } = require("../middlewares/auth");

router.get("/report", authenticateJWT, controller.generateReport);

module.exports = router;
