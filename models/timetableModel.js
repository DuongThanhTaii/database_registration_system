const db = require("../config/db");

const TimetableModel = {
  async getTimetable(studentId) {
    const res = await db.query(
      `
      SELECT 
        cc.class_id,
        cc.course_id,
        c.course_name,
        cc.schedule,
        cc.classroom,
        cc.start_date,
        cc.end_date,
        l.full_name AS lecturer_name
      FROM course_registration cr
      JOIN course_classes cc ON cr.class_id = cc.class_id
      JOIN courses c ON cc.course_id = c.course_id
      LEFT JOIN lecturers l ON cc.lecturer_id = l.lecturer_id
      WHERE cr.student_id = $1
      ORDER BY cc.schedule
      `,
      [studentId]
    );

    return res.rows;
  },
};

module.exports = TimetableModel;
