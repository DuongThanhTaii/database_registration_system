const express = require("express");
const router = express.Router();
const controller = require("../controllers/registrationController");
const { authenticateJWT } = require("../middlewares/auth");

router.post("/register", authenticateJWT, controller.registerCourse);
router.get("/history/:studentId", authenticateJWT, controller.getHistory);
router.delete("/cancel", authenticateJWT, controller.cancelRegistration);
router.get("/tuition/:studentId", authenticateJWT, controller.getTuition);
router.post("/confirm-payment", authenticateJWT, controller.confirmPayment);

module.exports = router;
