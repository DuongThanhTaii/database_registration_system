const db = require("../config/db");

const ClassModel = {
  async generateClasses() {
    const semester = "2025-1";
    const maxStudentsPerClass = 40;

    const res = await db.query(
      `
      SELECT course_id, COUNT(*) AS student_count
      FROM course_survey
      WHERE semester = $1
      GROUP BY course_id
    `,
      [semester]
    );

    const createdClasses = [];

    for (const row of res.rows) {
      const { course_id, student_count } = row;
      const numClasses = Math.ceil(student_count / maxStudentsPerClass);

      // Lấy thông tin môn học (để lấy department)
      const courseRes = await db.query(
        `SELECT * FROM courses WHERE course_id = $1`,
        [course_id]
      );
      const course = courseRes.rows[0];
      const department = course.department;

      // Tìm giảng viên phù hợp với khoa (chọn ngẫu nhiên 1 người)
      const lecturerRes = await db.query(
        `SELECT * FROM lecturers WHERE department = $1 ORDER BY RANDOM() LIMIT 1`,
        [department]
      );
      const lecturer = lecturerRes.rows[0];

      for (let i = 1; i <= numClasses; i++) {
        const class_id = `${course_id}_L${i}`;
        const schedule = `Mon-${i + 1}-3`;
        const classroom = `A10${i}`;
        const startDate = "2025-08-15";
        const endDate = "2025-12-15";

        // Check nếu class_id đã tồn tại
        const check = await db.query(
          `SELECT 1 FROM course_classes WHERE class_id = $1`,
          [class_id]
        );
        if (check.rowCount > 0) continue;

        const result = await db.query(
          `
          INSERT INTO course_classes (
            class_id, course_id, lecturer_id, schedule, classroom, start_date, end_date, max_students, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Available')
          RETURNING *
        `,
          [
            class_id,
            course_id,
            lecturer?.lecturer_id || null,
            schedule,
            classroom,
            startDate,
            endDate,
            maxStudentsPerClass,
          ]
        );

        createdClasses.push(result.rows[0]);
      }
    }

    return createdClasses;
  },
};

module.exports = ClassModel;
