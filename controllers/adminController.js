const db = require("../config/db");

const generateReport = async (req, res) => {
  try {
    // 1. Tổng số lớp theo môn học
    const classStats = await db.query(`
      SELECT course_id, COUNT(*) AS total_classes
      FROM course_classes
      GROUP BY course_id
    `);

    // 2. Tổng số sinh viên đăng ký theo học kỳ
    const studentStats = await db.query(`
      SELECT cc.course_id, EXTRACT(YEAR FROM cc.start_date) || '-' || EXTRACT(MONTH FROM cc.start_date) AS semester,
             COUNT(DISTINCT cr.student_id) AS total_students
      FROM course_registration cr
      JOIN course_classes cc ON cr.class_id = cc.class_id
      GROUP BY cc.course_id, semester
      ORDER BY semester DESC
    `);

    // 3. Tổng học phí thu được
    const tuitionStats = await db.query(`
      SELECT COUNT(*) * 700000 AS total_collected
      FROM course_registration
      WHERE is_paid = TRUE
    `);

    res.json({
      classStats: classStats.rows,
      studentStats: studentStats.rows,
      tuitionStats: tuitionStats.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      message: "Không thể tạo báo cáo",
      error: err.message,
    });
  }
};

module.exports = { generateReport };
