const TimetableModel = require("../models/timetableModel");

const getTimetable = async (req, res) => {
  try {
    const { studentId } = req.params;
    const timetable = await TimetableModel.getTimetable(studentId);
    res.json({ studentId, timetable });
  } catch (err) {
    res.status(500).json({
      message: "Không thể lấy thời khóa biểu",
      error: err.message,
    });
  }
};

module.exports = { getTimetable };
