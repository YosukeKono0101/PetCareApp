const connection = require("../config/dbConfig");

// Add a new pet
exports.addPet = async (req, res) => {
  const { name, type, gender, breed, age, weight, birthDate } = req.body;
  const query = `
    INSERT INTO pets (name, type, gender, breed, age, weight, birthDate, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  try {
    const [results] = await connection.execute(query, [
      name,
      type,
      gender,
      breed,
      parseInt(age, 10),
      parseFloat(weight),
      new Date(birthDate),
      req.userId,
    ]);
    res.send({
      status: "success",
      message: "Pet added successfully",
      petId: results.insertId,
    });
  } catch (error) {
    console.error("Error adding pet:", error);
    res.status(500).send({
      status: "error",
      message: "Database operation failed",
      error: error.message,
    });
  }
};

// Get all pets
exports.getPets = async (req, res) => {
  try {
    const [results] = await connection.execute(
      "SELECT * FROM pets WHERE user_id = ?",
      [req.userId]
    );
    res.send(results);
  } catch (error) {
    console.error("Error retrieving pets:", error);
    res.status(500).send({
      status: "error",
      message: "Failed to retrieve pets",
      error: error.message,
    });
  }
};

// Get pet details by ID
exports.getPetDetails = async (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT name, type, gender, breed, age, weight, DATE_FORMAT(birthDate, '%Y-%m-%d') AS birthDate
    FROM pets
    WHERE id = ? AND user_id = ?`;

  try {
    const [results] = await connection.execute(query, [id, req.userId]);
    if (results.length === 0) {
      return res
        .status(404)
        .send({ status: "error", message: "Pet not found" });
    }
    res.send(results[0]);
  } catch (error) {
    console.error("Error retrieving pet details:", error);
    res.status(500).send({
      status: "error",
      message: "Failed to retrieve pet details",
      error: error.message,
    });
  }
};

// Update a pet
exports.updatePet = async (req, res) => {
  const { id } = req.params;
  const { name, type, gender, breed, age, weight, birthDate } = req.body;
  const query = `
    UPDATE pets
    SET name = ?, type = ?, gender = ?, breed = ?, age = ?, weight = ?, birthDate = ?
    WHERE id = ? AND user_id = ?`;

  try {
    const [results] = await connection.execute(query, [
      name,
      type,
      gender,
      breed,
      parseInt(age, 10),
      parseFloat(weight),
      new Date(birthDate),
      id,
      req.userId,
    ]);
    if (results.affectedRows === 0) {
      return res
        .status(404)
        .send({ status: "error", message: "Pet not found" });
    }
    res.send({ status: "success", message: "Pet updated successfully" });
  } catch (error) {
    console.error("Error updating pet:", error);
    res.status(500).send({
      status: "error",
      message: "Database operation failed",
      error: error.message,
    });
  }
};

// Delete a pet
exports.deletePet = async (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM pets WHERE id = ? AND user_id = ?";

  try {
    const [results] = await connection.execute(query, [id, req.userId]);
    if (results.affectedRows === 0) {
      return res
        .status(404)
        .send({ status: "error", message: "Pet not found" });
    }
    res.send({ status: "success", message: "Pet deleted successfully" });
  } catch (error) {
    console.error("Error deleting pet:", error);
    res.status(500).send({
      status: "error",
      message: "Database operation failed",
      error: error.message,
    });
  }
};
