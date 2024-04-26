const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
require("dotenv").config();
const PORT = 3000;

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

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
    const query = "INSERT INTO users (username, password) VALUES (?, ?)";
    connection.query(query, [username, hashedPassword], (error, results) => {
      if (error) {
        return res.status(500).send({
          status: "error",
          message: "Database operation failed",
          error: error,
        });
      }
      res.send({
        status: "success",
        message: "User registered successfully",
        userId: results.insertId,
      });
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Password hashing failed",
      error: error,
    });
  }
});

// user authentication
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM users WHERE username = ?";
  connection.query(query, [username], async (error, results) => {
    if (error) {
      return res.status(500).send({
        status: "error",
        message: "Database operation failed",
        error: error,
      });
    }
    if (results.length === 0) {
      res.status(401).send({ status: "error", message: "User not found" });
    } else {
      const match = await bcrypt.compare(password, results[0].password);
      if (match) {
        res.send({ status: "success", message: "Login successfully" });
      } else {
        res
          .status(401)
          .send({ status: "error", message: "Invalid username or password" });
      }
    }
  });
});

/********************/
/*    Pets Info     */
/********************/

// add pet info to the database
app.post("/pets", (req, res) => {
  const { name, type } = req.body;
  const query = "INSERT INTO pets (name, type) VALUES (?, ?)";
  connection.query(query, [name, type], (error, results) => {
    if (error) {
      return res.status(500).send({
        status: "error",
        message: "Database operation failed",
        error: error,
      });
    }
    res.send({
      status: "success",
      message: "Pet added successfully",
      petId: results.insertId,
    });
  });
});

// get pet info from the database
app.get("/pets", (req, res) => {
  connection.query("SELECT * FROM pets", (error, results) => {
    if (error) {
      return res.status(500).send({
        status: "error",
        message: "Failed to retrieve pets",
        error: error,
      });
    }
    res.send(results);
  });
});

// update pet info by id from the database
app.put("/pets/:id", (req, res) => {
  const { name, type } = req.body;
  const { id } = req.params;
  const query = "UPDATE pets SET name = ?, type = ? WHERE id = ?";
  connection.query(query, [name, type, id], (error, results) => {
    if (error) {
      return res.status(500).send({
        status: "error",
        message: "Database operation failed",
        error: error,
      });
    }
    if (results.affectedRows === 0) {
      return res
        .status(404)
        .send({ status: "error", message: "Pet not found" });
    }
    res.send({ status: "success", message: "Pet updated successfully" });
  });
});

// delete pet info from the database
app.delete("/pets/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM pets WHERE id = ?";
  connection.query(query, [id], (error, results) => {
    if (error) {
      return res.status(500).send({
        status: "error",
        message: "Database operation failed",
        error: error,
      });
    }
    if (results.affectedRows === 0) {
      return res
        .status(404)
        .send({ status: "error", message: "Pet not found" });
    }
    res.send({ status: "success", message: "Pet deleted successfully" });
  });
});

/********************/
/*   Health Logs    */
/********************/

// add health log to the database
app.post("/health-logs", (req, res) => {
  const { pet_id, log_data, details } = req.body;
  const query =
    "INSERT INTO health_logs (pet_id, log_data, details) VALUES (?, ?, ?)";
  connection.query(query, [pet_id, log_data, details], (error, results) => {
    if (error) {
      return res.status(500).send({
        status: "error",
        message: "Database operation failed",
        error: error,
      });
    }
    res.send({
      status: "success",
      message: "Health log added successfully",
      logId: results.insertId,
    });
  });
});

// get health logs from the database
app.get("/health-logs", (req, res) => {
  const query = "SELECT * FROM health_logs";
  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).send({
        status: "error",
        message: "Failed to retrieve health logs",
        error: error,
      });
    }
    res.send(results);
  });
});

// update health log by id from the database
app.put("/health-logs/:id", (req, res) => {
  const { id } = req.params;
  const { pet_id, log_data, details } = req.body;
  const query =
    "UPDATE health_logs SET pet_id = ?, log_data = ?, details = ? WHERE id = ?";
  connection.query(query, [pet_id, log_data, details, id], (error, results) => {
    if (error) {
      return res.status(500).send({
        status: "error",
        message: "Failed to update health log",
        error: error,
      });
    }
    if (results.affectedRows === 0) {
      return res
        .status(404)
        .send({ status: "error", message: "Health log not found" });
    }
    res.status({
      status: "success",
      message: "Health log updated successfully",
    });
  });
});

// delete health log from the database
app.delete("/health-logs/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM health_logs WHERE id = ?";
  connection.query(query, [id], (error, results) => {
    if (error) {
      return res.status(500).send({
        status: "error",
        message: "Failed to delete health log",
        error: error,
      });
    }
    if (results.affectedRows === 0) {
      return res
        .status(404)
        .send({ status: "error", message: "Health log not found" });
    }
    res.send({
      status: "success",
      message: "Health log deleted successfully",
    });
  });
});

/********************/
/*   Vaccination    */
/********************/

// add vaccination to the database
app.post("/care/vaccination", (req, res) => {
  const { pet_id, vaccine_name, vaccination_date } = req.body;
  const query =
    "INSERT INTO vaccinations (pet_id, vaccine_name, vaccination_date) VALUES (?, ?, ?)";
  connection.query(
    query,
    [pet_id, vaccine_name, vaccination_date],
    (error, results) => {
      if (error) {
        return res.status(500).send({
          status: "error",
          message: "Database operation failed",
          error: error,
        });
      }
      res.send({
        status: "success",
        message: "Vaccination added successfully",
        vaccinationId: results.insertId,
      });
    }
  );
});

// get vaccination from the database
app.get("/care/vaccination", (req, res) => {
  const query = "SELECT * FROM vaccinations";
  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).send({
        status: "error",
        message: "Failed to retrieve vaccinations",
        error: error,
      });
    }
    res.send(results);
  });
});

// update vaccination from the database
app.put("/care/vaccination/:id", (req, res) => {
  const { id } = req.params;
  const { pet_id, vaccine_name, vaccination_date } = req.body;
  const query =
    "UPDATE vaccinations SET pet_id = ?, vaccine_name = ?, vaccination_date = ? WHERE id = ?";
  connection.query(
    query,
    [pet_id, vaccine_name, vaccination_date, id],
    (error, results) => {
      if (error) {
        return res.status(500).send({
          status: "error",
          message: "Failed to update vaccination",
          error: error,
        });
      }
      if (results.affectedRows === 0) {
        return res
          .status(404)
          .send({ status: "error", message: "Vaccination not found" });
      }
      res.send({
        status: "success",
        message: "Vaccination updated successfully",
      });
    }
  );
});

// delete vaccination from the database
app.delete("/care/vaccination/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM vaccinations WHERE id = ?";
  connection.query(query, [id], (error, results) => {
    if (error) {
      return res.status(500).send({
        status: "error",
        message: "Failed to delete vaccination",
        error: error,
      });
    }
    if (results.affectedRows === 0) {
      return res
        .status(404)
        .send({ status: "error", message: "Vaccination not found" });
    }
    res.send({
      status: "success",
      message: "Vaccination deleted successfully",
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
