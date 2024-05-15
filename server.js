const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
require("dotenv").config();
const PORT = 3000;

const connection = mysql
  .createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  })
  .promise();

// connect to the database
connection.connect((err) => {
  if (err) {
    return console.error("error connecting: " + err.stack);
  }
  console.log("connected as id " + connection.threadId);
});

const app = express();
app.use(express.json());

/********************/
/*    password      */
/********************/

// user registration
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [results] = await connection.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword]
    );
    res.send({
      status: "success",
      message: "User registered successfully",
      userId: results.insertId,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Database operation failed",
      error: error.message,
    });
  }
});

// user authentication
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt for username:", username);
  console.log("Login attempt for password:", password);
  try {
    const [results] = await connection.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    console.log("User fetch results:", results);
    if (results.length === 0) {
      res.status(401).send({ status: "error", message: "User not found" });
    } else {
      const match = await bcrypt.compare(password, results[0].password);
      console.log("Password comparison results:", match);
      if (match) {
        res.send({ status: "success", message: "Login successfully" });
      } else {
        res
          .status(401)
          .send({ status: "error", message: "Invalid username or password" });
      }
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Database operation failed",
      error: error.message,
    });
  }
});

/********************/
/*    Pets Info     */
/********************/

// add pet info to the database
app.post("/pets", async (req, res) => {
  const { name, type, gender, breed, age, weight, birthDate } = req.body;
  const query = `
    INSERT INTO pets (name, type, gender, breed, age, weight, birthDate)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  try {
    const [results] = await connection.execute(query, [
      name,
      type,
      gender,
      breed,
      parseInt(age, 10),
      parseFloat(weight),
      new Date(birthDate),
    ]);
    res.send({
      status: "success",
      message: "Pet added successfully",
      petId: results.insertId,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Database operation failed",
      error: error.message,
    });
  }
});

// get pet info from the database
app.get("/pets", async (req, res) => {
  try {
    const [results] = await connection.execute("SELECT * FROM pets");
    res.send(results);
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Failed to retrieve pets",
      error: error,
    });
  }
});

// get pet details by if from the database
app.get("/pets/:id", async (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT name, type, gender, breed, age, weight, DATE_FORMAT(birthDate, '%Y-%m-%d') AS birthDate
    FROM pets
    WHERE id = ?`;

  try {
    const [results] = await connection.execute(query, [id]);
    if (results.length === 0) {
      res.status(404).send({ status: "error", message: "Pet not found" });
    } else {
      res.send(results[0]);
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Failed to retrieve pet details",
      error: error,
    });
  }
});

// update pet info by id from the database
app.put("/pets/:id", async (req, res) => {
  const { id } = req.params;
  const { name, type, gender, breed, age, weight, birthDate } = req.body;
  const query = `
    UPDATE pets
    SET name = ?, type = ?, gender = ?, breed = ?, age = ?, weight = ?, birthDate = ?
    WHERE id = ?`;

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
    ]);
    if (results.affectedRows === 0) {
      return res
        .status(404)
        .send({ status: "error", message: "Pet not found" });
    }
    res.send({ status: "success", message: "Pet updated successfully" });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Database operation failed",
      error: error.message,
    });
  }
});

// delete pet info from the database
app.delete("/pets/:id", async (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM pets WHERE id = ?";
  try {
    const [results] = await connection.execute(query, [id]);
    if (results.affectedRows === 0) {
      return res
        .status(404)
        .send({ status: "error", message: "Pet not found" });
    }
    res.send({ status: "success", message: "Pet deleted successfully" });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Database operation failed",
      error: error,
    });
  }
});

/********************/
/*   Health Logs    */
/********************/

// add health log to the database
app.post("/health-logs", async (req, res) => {
  const { pet_id, log_date, details } = req.body;
  const query =
    "INSERT INTO health_logs (pet_id, log_date, details) VALUES (?, ?, ?)";
  try {
    const [results] = await connection.execute(query, [
      pet_id,
      new Date(log_date), // Ensure date format
      details,
    ]);
    res.send({
      status: "success",
      message: "Health log added successfully",
      logId: results.insertId,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Database operation failed",
      error: error,
    });
  }
});

// get health logs from the database
app.get("/health-logs", async (req, res) => {
  try {
    const [results] = await connection.execute("SELECT * FROM health_logs");
    res.send(results);
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Failed to retrieve health logs",
      error: error,
    });
  }
});

// Get a specific health log by id from the database
app.get("/health-logs/:id", async (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT hl.id, hl.log_date, hl.details, p.name as pet_name
    FROM health_logs hl
    JOIN pets p ON hl.pet_id = p.id
    WHERE hl.id = ?`;

  try {
    const [results] = await connection.execute(query, [id]);
    if (results.length > 0) {
      res.send(results[0]);
    } else {
      res
        .status(404)
        .send({ status: "error", message: "Health log not found" });
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Failed to retrieve health log",
      error: error.message,
    });
  }
});

// update health log by id from the database
app.put("/health-logs/:id", async (req, res) => {
  const { id } = req.params;
  const { pet_id, log_date, details } = req.body;
  const query = `
    UPDATE health_logs
    SET pet_id = ?, log_date = ?, details = ?
    WHERE id = ?`;

  try {
    const [results] = await connection.execute(query, [
      pet_id,
      log_date,
      details,
      id,
    ]);
    if (results.affectedRows === 0) {
      return res
        .status(404)
        .send({ status: "error", message: "Health log not found" });
    }
    res.send({ status: "success", message: "Health log updated successfully" });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Failed to update health log",
      error: error.message,
    });
  }
});

// delete health log from the database
app.delete("/health-logs/:id", async (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM health_logs WHERE id = ?";
  try {
    const [results] = await connection.execute(query, [id]);
    if (results.affectedRows === 0) {
      return res
        .status(404)
        .send({ status: "error", message: "Health log not found" });
    }
    res.send({
      status: "success",
      message: "Health log deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Failed to delete health log",
      error: error,
    });
  }
});

/********************/
/*   Vaccination    */
/********************/

// add vaccination to the database
app.post("/vaccination", async (req, res) => {
  const { pet_id, vaccine_name, vaccination_date } = req.body;
  const query =
    "INSERT INTO vaccinations (pet_id, vaccine_name, vaccination_date) VALUES (?, ?, ?)";
  try {
    const [results] = await connection.execute(query, [
      pet_id,
      vaccine_name,
      vaccination_date,
    ]);
    res.send({
      status: "success",
      message: "Vaccination added successfully",
      vaccinationId: results.insertId,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Database operation failed",
      error: error,
    });
  }
});

// get vaccination from the database
app.get("/vaccination", async (req, res) => {
  const query = "SELECT * FROM vaccinations";
  try {
    const [results] = await connection.execute(query);
    res.send(results);
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Failed to retrieve vaccinations",
      error: error,
    });
  }
});

// get a specific vaccination by id from the database
app.get("/vaccination/:id", async (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM vaccinations WHERE id = ?";

  try {
    const [results] = await connection.execute(query, [id]);
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
    res.status(500).send({
      status: "error",
      message: "Failed to retrieve vaccination",
      error: error,
    });
  }
});

// update vaccination from the database
app.put("/vaccination/:id", async (req, res) => {
  const { id } = req.params;
  const { pet_id, vaccine_name, vaccination_date } = req.body;
  const query =
    "UPDATE vaccinations SET pet_id = ?, vaccine_name = ?, vaccination_date = ? WHERE id = ?";
  try {
    const [results] = await connection.execute(query, [
      pet_id,
      vaccine_name,
      vaccination_date,
      id,
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
    res.status(500).send({
      status: "error",
      message: "Failed to update vaccination",
      error: error,
    });
  }
});

// delete vaccination from the database
app.delete("/vaccination/:id", async (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM vaccinations WHERE id = ?";
  try {
    const [results] = await connection.execute(query, [id]);
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
    res.status(500).send({
      status: "error",
      message: "Failed to delete vaccination",
      error: error,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
