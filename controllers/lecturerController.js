const LecturerModel = require("../models/lecturerModel");

const registerTeaching = async (req, res) => {
  try {
    const { lecturerId, classId } = req.body;

    const result = await LecturerModel.registerTeaching(lecturerId, classId);
    res.json(result);
  } catch (err) {
    res.status(400).json({
      message: "Không thể đăng ký giảng dạy",
      error: err.message,
    });
  }
};

module.exports = { registerTeaching };
