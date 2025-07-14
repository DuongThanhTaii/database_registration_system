const db = require("../config/db");

const LecturerModel = {
  async registerTeaching(lecturerId, classId) {
    // 1. Kiểm tra lớp có tồn tại không
    const classCheck = await db.query(
      `SELECT * FROM course_classes WHERE class_id = $1`,
      [classId]
    );
    if (classCheck.rowCount === 0)
      throw new Error("Lớp học phần không tồn tại");

    const courseClass = classCheck.rows[0];

    // 2. Lớp đã có giảng viên khác chưa?
    if (courseClass.lecturer_id) throw new Error("Lớp đã có giảng viên dạy");

    // 3. Lấy thông tin giảng viên
    const lecturer = await db.query(
      `SELECT * FROM lecturers WHERE lecturer_id = $1`,
      [lecturerId]
    );
    if (lecturer.rowCount === 0) throw new Error("Giảng viên không tồn tại");

    const { lecturer_type } = lecturer.rows[0];

    // 4. Giới hạn số lớp theo loại
    const typeLimits = {
      "PhD Student": 1,
      Regular: 2,
      Senior: 3,
    };
    const maxClasses = typeLimits[lecturer_type] || 1;

    const current = await db.query(
      `SELECT * FROM course_classes WHERE lecturer_id = $1`,
      [lecturerId]
    );
    if (current.rowCount >= maxClasses)
      throw new Error("Vượt quá số lớp được phép đăng ký");

    // 5. Kiểm tra trùng lịch
    for (let c of current.rows) {
      if (c.schedule === courseClass.schedule) {
        throw new Error("Trùng lịch dạy với lớp khác");
      }
    }

    // 6. Cập nhật lớp
    await db.query(
      `UPDATE course_classes SET lecturer_id = $1 WHERE class_id = $2`,
      [lecturerId, classId]
    );

    return { message: "Đăng ký thành công", class: courseClass };
  },
};

module.exports = LecturerModel;
