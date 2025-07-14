const express = require("express");
const router = express.Router();
const StudentController = require("../controllers/studentController");
const { authenticateJWT } = require("../middlewares/auth");

router.post("/register", StudentController.register);
router.post("/login", StudentController.login);
//router.get("/me", authenticateJWT, controller.getProfile);

module.exports = router;
