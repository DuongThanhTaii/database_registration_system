const express = require("express");
const router = express.Router();
const controller = require("../controllers/classController");

// ✅ KHÔNG gọi hàm
router.get("/open", controller.getOpenClasses);

module.exports = router;
