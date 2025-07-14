const db = require("../config/db");

const SystemModel = {
  async updatePhase(phase) {
    const query = `
      UPDATE system_status
      SET current_phase = $1,
          is_locked = true,
          start_date = CURRENT_TIMESTAMP
      WHERE id = 1
      RETURNING *;
    `;
    const result = await db.query(query, [phase]);
    return result.rows[0];
  },
};

module.exports = SystemModel;
