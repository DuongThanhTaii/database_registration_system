const express = require("express");
const router = express.Router();
const controller = require("../controllers/lecturerController");
const { authenticateJWT } = require("../middlewares/auth");

router.post("/register-teaching", authenticateJWT, controller.registerTeaching);
//router.get("/my-classes/:lecturerId", authenticateJWT, controller.getMyClasses);

module.exports = router;
