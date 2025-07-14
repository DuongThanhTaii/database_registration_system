const db = require("../config/db");

const RegistrationModel = {
  // Đăng ký học phần
  async register(studentId, classId) {
    // 1. Kiểm tra sinh viên tồn tại
    const studentRes = await db.query(
      `SELECT * FROM students WHERE student_id = $1`,
      [studentId]
    );
    if (studentRes.rowCount === 0) throw new Error("Sinh viên không tồn tại");
    const student = studentRes.rows[0];

    // 2. Kiểm tra lớp học phần tồn tại
    const classRes = await db.query(
      `SELECT * FROM course_classes WHERE class_id = $1`,
      [classId]
    );
    if (classRes.rowCount === 0) throw new Error("Lớp học phần không tồn tại");
    const courseClass = classRes.rows[0];

    // 3. Kiểm tra sĩ số lớp
    const countRes = await db.query(
      `SELECT COUNT(*) FROM course_registration WHERE class_id = $1`,
      [classId]
    );
    if (parseInt(countRes.rows[0].count) >= courseClass.max_students) {
      throw new Error("Lớp đã đầy");
    }

    // 4. Kiểm tra trùng lịch học
    const schedule = courseClass.schedule;
    const scheduleConflict = await db.query(
      `SELECT cc.class_id FROM course_registration cr
       JOIN course_classes cc ON cr.class_id = cc.class_id
       WHERE cr.student_id = $1 AND cc.schedule = $2`,
      [studentId, schedule]
    );
    if (scheduleConflict.rowCount > 0) {
      throw new Error("Trùng lịch với lớp đã đăng ký");
    }

    // 5. Kiểm tra điều kiện tiên quyết
    const courseRes = await db.query(
      `SELECT * FROM courses WHERE course_id = $1`,
      [courseClass.course_id]
    );
    const course = courseRes.rows[0];

    if (course.prerequisite_course) {
      const passed = student.completed_courses?.includes(
        course.prerequisite_course
      );
      if (!passed) {
        throw new Error(
          "Chưa đạt môn tiên quyết: " + course.prerequisite_course
        );
      }
    }

    // 6. Đăng ký lớp học phần
    await db.query(
      `INSERT INTO course_registration (student_id, class_id, is_paid, registered_at)
       VALUES ($1, $2, FALSE, NOW())`,
      [studentId, classId]
    );

    return { message: "Đăng ký thành công", classId };
  },

  // Lấy lịch sử đăng ký
  async getHistory(studentId) {
    const res = await db.query(
      `SELECT cr.registration_id, cr.class_id, cc.course_id, c.course_name,
              cc.schedule, cc.classroom, cc.start_date, cc.end_date,
              cr.is_paid, cr.registered_at
       FROM course_registration cr
       JOIN course_classes cc ON cr.class_id = cc.class_id
       JOIN courses c ON cc.course_id = c.course_id
       WHERE cr.student_id = $1
       ORDER BY cr.registered_at DESC`,
      [studentId]
    );
    return res.rows;
  },

  // Hủy đăng ký lớp
  async cancelRegistration(studentId, classId) {
    const result = await db.query(
      `DELETE FROM course_registration
       WHERE student_id = $1 AND class_id = $2
       RETURNING *`,
      [studentId, classId]
    );
    if (result.rowCount === 0) throw new Error("Không tìm thấy đăng ký");
    return { message: "Hủy đăng ký thành công", classId };
  },

  // Tính học phí (chưa thanh toán)
  async calculateTuition(studentId) {
    const res = await db.query(
      `SELECT cc.class_id
       FROM course_registration cr
       JOIN course_classes cc ON cr.class_id = cc.class_id
       WHERE cr.student_id = $1 AND cr.is_paid = FALSE`,
      [studentId]
    );
    const total = res.rowCount * 700000;
    return { studentId, totalUnpaidTuition: total };
  },

  // Xác nhận thanh toán học phí
  async markAsPaid(studentId) {
    const result = await db.query(
      `UPDATE course_registration
       SET is_paid = TRUE
       WHERE student_id = $1 AND is_paid = FALSE
       RETURNING *`,
      [studentId]
    );
    return {
      message: `Đã xác nhận thanh toán cho ${result.rowCount} lớp`,
      updated: result.rows,
    };
  },

  // (Tùy chọn) Lấy danh sách lớp chưa thanh toán
  async getUnpaidClasses(studentId) {
    const res = await db.query(
      `SELECT cr.class_id, c.course_name
       FROM course_registration cr
       JOIN course_classes cc ON cr.class_id = cc.class_id
       JOIN courses c ON cc.course_id = c.course_id
       WHERE cr.student_id = $1 AND cr.is_paid = FALSE`,
      [studentId]
    );
    return res.rows;
  },
};

module.exports = RegistrationModel;
