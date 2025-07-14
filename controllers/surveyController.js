const SurveyModel = require("../models/surveyModel");

const SurveyController = {
  async submitSurvey(req, res) {
    const { student_id, semester, course_id } = req.body;
    console.log("[📥 INPUT]", req.body); // in dữ liệu vào

    try {
      const result = await SurveyModel.createSurvey(
        student_id,
        semester,
        course_id
      );
      res.status(201).json(result);
    } catch (err) {
      console.error("[❌ ERROR]", err); // << in rõ lỗi
      res
        .status(500)
        .json({ message: "Ghi danh thất bại", error: err.message });
    }
  },

  async viewSurvey(req, res) {
    const { student_id, semester } = req.query;
    try {
      const list = await SurveyModel.getSurveyByStudent(student_id, semester);
      res.json(list);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi khi lấy danh sách ghi danh" });
    }
  },
};

module.exports = SurveyController;
