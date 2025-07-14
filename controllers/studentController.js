const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const StudentModel = require("../models/studentModel");

const StudentController = {
  async register(req, res) {
    try {
      const { student_id, full_name, birth_date, gender, major, password } =
        req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newStudent = await StudentModel.createStudent({
        student_id,
        full_name,
        birth_date,
        gender,
        major,
        password_hash: hashedPassword,
      });
      res.status(201).json(newStudent);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi server khi đăng ký sinh viên" });
    }
  },

  async login(req, res) {
    try {
      const { student_id, password } = req.body;
      const student = await StudentModel.findById(student_id);
      if (!student)
        return res.status(404).json({ message: "Không tìm thấy sinh viên" });

      const match = await bcrypt.compare(password, student.password);
      if (!match) return res.status(401).json({ message: "Sai mật khẩu" });

      const token = jwt.sign(
        { student_id: student.student_id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({ token, student });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi đăng nhập" });
    }
  },
};

module.exports = StudentController;
