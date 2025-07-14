const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  const { username, password } = req.body;

  // Kiểm tra trong bảng admin, sinh viên, giảng viên
  let user, role;

  const adminRes = await db.query(`SELECT * FROM admins WHERE username = $1`, [
    username,
  ]);
  if (adminRes.rowCount > 0) {
    user = adminRes.rows[0];
    role = "admin";
  }

  const lecturerRes = await db.query(
    `SELECT * FROM lecturers WHERE username = $1`,
    [username]
  );
  if (lecturerRes.rowCount > 0) {
    user = lecturerRes.rows[0];
    role = "lecturer";
  }

  const studentRes = await db.query(
    `SELECT * FROM students WHERE student_id::text = $1`,
    [username]
  );
  if (studentRes.rowCount > 0) {
    user = studentRes.rows[0];
    role = "student";
  }

  if (!user) {
    return res.status(401).json({ message: "Tài khoản không tồn tại" });
  }

  // So sánh password (giả định đã hash từ trước)
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: "Sai mật khẩu" });
  }

  // Tạo JWT
  const token = jwt.sign(
    {
      userId: user.admin_id || user.lecturer_id || user.student_id,
      role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ message: "Đăng nhập thành công", token, role });
};

module.exports = { login };
