const pool = require("../database");

const StudentModel = {
  async createStudent({
    student_id,
    full_name,
    birth_date,
    gender,
    major,
    password_hash,
  }) {
    const query = `
      INSERT INTO students (student_id, full_name, birth_date, gender, major, password)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING student_id, full_name
    `;
    const values = [
      student_id,
      full_name,
      birth_date,
      gender,
      major,
      password_hash,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findById(student_id) {
    const result = await pool.query(
      "SELECT * FROM students WHERE student_id = $1",
      [student_id]
    );
    return result.rows[0];
  },
};

module.exports = StudentModel;
