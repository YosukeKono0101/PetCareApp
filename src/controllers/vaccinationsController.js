const connection = require("../config/dbConfig");

// Add a new vaccination
exports.addVaccination = async (req, res) => {
  const { pet_id, vaccine_name, vaccination_date } = req.body;
  const query =
    "INSERT INTO vaccinations (pet_id, vaccine_name, vaccination_date, user_id) VALUES (?, ?, ?, ?)";

  try {
    const [results] = await connection.execute(query, [
      pet_id,
      vaccine_name,
      new Date(vaccination_date),
      req.userId,
    ]);
    res.send({
      status: "success",
      message: "Vaccination added successfully",
      vaccinationId: results.insertId,
    });
  } catch (error) {
    console.error("Error adding vaccination:", error);
    res.status(500).send({
      status: "error",
      message: "Database operation failed",
      error: error.message,
    });
  }
};

// Get all vaccinations
exports.getVaccinations = async (req, res) => {
  const query = "SELECT * FROM vaccinations WHERE user_id = ?";

  try {
    const [results] = await connection.execute(query, [req.userId]);
    res.send(results);
  } catch (error) {
    console.error("Error retrieving vaccinations:", error);
    res.status(500).send({
      status: "error",
      message: "Failed to retrieve vaccinations",
      error: error.message,
    });
  }
};

// Get vaccination by ID
exports.getVaccinationById = async (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT v.*, p.name AS pet_name
    FROM vaccinations v
    JOIN pets p ON v.pet_id = p.id
    WHERE v.id = ? AND v.user_id = ?
  `;

  try {
    const [results] = await connection.execute(query, [id, req.userId]);
    if (results.length === 0) {
      return res.status(404).send({
        status: "error",
        message: "Vaccination not found",
      });
    }
    res.send({
      status: "success",
      message: "Vaccination retrieved successfully",
      data: results[0],
    });
  } catch (error) {
    console.error("Error retrieving vaccination:", error);
    res.status(500).send({
      status: "error",
      message: "Failed to retrieve vaccination",
      error: error.message,
    });
  }
};

// Update a vaccination
exports.updateVaccination = async (req, res) => {
  const { id } = req.params;
  const { vaccine_name, vaccination_date } = req.body;
  const query =
    "UPDATE vaccinations SET vaccine_name = ?, vaccination_date = ? WHERE id = ? AND user_id = ?";

  try {
    const [results] = await connection.execute(query, [
      vaccine_name,
      new Date(vaccination_date),
      id,
      req.userId,
    ]);
    if (results.affectedRows === 0) {
      return res
        .status(404)
        .send({ status: "error", message: "Vaccination not found" });
    }
    res.send({
      status: "success",
      message: "Vaccination updated successfully",
    });
  } catch (error) {
    console.error("Error updating vaccination:", error);
    res.status(500).send({
      status: "error",
      message: "Failed to update vaccination",
      error: error.message,
    });
  }
};

// Delete a vaccination
exports.deleteVaccination = async (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM vaccinations WHERE id = ? AND user_id = ?";

  try {
    const [results] = await connection.execute(query, [id, req.userId]);
    if (results.affectedRows === 0) {
      return res
        .status(404)
        .send({ status: "error", message: "Vaccination not found" });
    }
    res.send({
      status: "success",
      message: "Vaccination deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting vaccination:", error);
    res.status(500).send({
      status: "error",
      message: "Failed to delete vaccination",
      error: error.message,
    });
  }
};
