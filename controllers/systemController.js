const systemModel = require("../models/systemModel");

exports.closeSurvey = async (req, res) => {
  try {
    const result = await systemModel.updatePhase("Course Opening");
    res.status(200).json({
      message:
        "✅ Ghi danh đã được chốt. Hệ thống chuyển sang giai đoạn mở lớp học phần.",
      result,
    });
  } catch (err) {
    console.error("[❌ ERROR closeSurvey]", err);
    res
      .status(500)
      .json({ message: "❌ Không thể chốt ghi danh", error: err.message });
  }
};
