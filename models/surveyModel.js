const db = require("../config/db"); // hoặc pool

const SurveyModel = {
  async createSurvey(student_id, semester, course_id) {
    const query = `
      INSERT INTO course_survey (student_id, semester, course_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    try {
      const result = await db.query(query, [student_id, semester, course_id]);
      return result.rows[0];
    } catch (error) {
      console.error("[DB ERROR]", error); // thêm dòng này
      throw error;
    }
  },
};

module.exports = SurveyModel;
