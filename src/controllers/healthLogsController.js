const connection = require("../config/dbConfig");

// Add a new health log
exports.addHealthLog = async (req, res) => {
  const { pet_id, log_date, details } = req.body;
  const query =
    "INSERT INTO health_logs (pet_id, user_id, log_date, details) VALUES (?, ?, ?, ?)";

  try {
    const [results] = await connection.execute(query, [
      pet_id,
      req.userId,
      new Date(log_date),
      details,
    ]);
    res.send({
      status: "success",
      message: "Health log added successfully",
      logId: results.insertId,
    });
  } catch (error) {
    console.error("Error adding health log:", error);
    res.status(500).send({
      status: "error",
      message: "Database operation failed",
      error: error.message,
    });
  }
};

// Get all health logs
exports.getHealthLogs = async (req, res) => {
  try {
    const [results] = await connection.execute(
      "SELECT * FROM health_logs WHERE user_id = ?",
      [req.userId]
    );
    res.send(results);
  } catch (error) {
    console.error("Error retrieving health logs:", error);
    res.status(500).send({
      status: "error",
      message: "Failed to retrieve health logs",
      error: error.message,
    });
  }
};

// Get a health log by ID
exports.getHealthLogById = async (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT hl.id, hl.log_date, hl.details, p.name as pet_name
    FROM health_logs hl
    JOIN pets p ON hl.pet_id = p.id
    WHERE hl.id = ? AND hl.user_id = ?`;

  try {
    const [results] = await connection.execute(query, [id, req.userId]);
    if (results.length > 0) {
      res.send(results[0]);
    } else {
      res
        .status(404)
        .send({ status: "error", message: "Health log not found" });
    }
  } catch (error) {
    console.error("Error retrieving health log:", error);
    res.status(500).send({
      status: "error",
      message: "Failed to retrieve health log",
      error: error.message,
    });
  }
};

// Update a health log
exports.updateHealthLog = async (req, res) => {
  const { id } = req.params;
  const { log_date, details } = req.body;
  const query = `
    UPDATE health_logs
    SET log_date = ?, details = ?
    WHERE id = ? AND user_id = ?`;

  try {
    const [results] = await connection.execute(query, [
      new Date(log_date),
      details,
      id,
      req.userId,
    ]);
    if (results.affectedRows === 0) {
      return res
        .status(404)
        .send({ status: "error", message: "Health log not found" });
    }
    res.send({ status: "success", message: "Health log updated successfully" });
  } catch (error) {
    console.error("Error updating health log:", error);
    res.status(500).send({
      status: "error",
      message: "Failed to update health log",
      error: error.message,
    });
  }
};

// Delete a health log
exports.deleteHealthLog = async (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM health_logs WHERE id = ? AND user_id = ?";

  try {
    const [results] = await connection.execute(query, [id, req.userId]);
    if (results.affectedRows === 0) {
      return res
        .status(404)
        .send({ status: "error", message: "Health log not found" });
    }
    res.send({ status: "success", message: "Health log deleted successfully" });
  } catch (error) {
    console.error("Error deleting health log:", error);
    res.status(500).send({
      status: "error",
      message: "Failed to delete health log",
      error: error.message,
    });
  }
};
