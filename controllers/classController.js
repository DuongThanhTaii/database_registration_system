const ClassModel = require("../models/classModel");

const getOpenClasses = async (req, res) => {
  try {
    const classes = await ClassModel.getOpenClasses();
    res.json({ message: "Danh sách lớp học phần đang mở", classes });
  } catch (err) {
    res.status(500).json({
      message: "Không thể lấy danh sách lớp học phần",
      error: err.message,
    });
  }
};

module.exports = { getOpenClasses };
