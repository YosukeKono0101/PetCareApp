const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("../config/dbConfig");
const SECRET_KEY = process.env.SECRET_KEY;

// Register a new user
exports.register = async (req, res) => {
  const { username, password } = req.body;
  // Hash the password
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [results] = await connection.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword]
    );

    // Generate a token
    const token = jwt.sign({ userId: results.insertId }, SECRET_KEY, {
      expiresIn: "1h",
    });

    // Send the response
    res.send({
      status: "success",
      message: "User registered successfully",
      userId: results.insertId,
      token,
    });
  } catch (error) {
    // Handle the error
    res.status(500).send({
      status: "error",
      message: "Database operation failed",
      error: error.message,
    });
  }
};

// Login a user
exports.login = async (req, res) => {
  const { username, password } = req.body;
  // Check if the user exists
  try {
    const [results] = await connection.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    // If the user does not exist
    if (results.length === 0) {
      res.status(401).send({ status: "error", message: "User not found" });
    } else {
      // If the user exists
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
          expiresIn: "1h",
        });
        res.send({
          status: "success",
          message: "Login successful",
          token,
          userData: {
            id: user.id,
            username: user.username,
          },
        });
      } else {
        // If the password does not match
        res
          .status(401)
          .send({ status: "error", message: "Invalid username or password" });
      }
    }
  } catch (error) {
    // Handle the error
    res.status(500).send({
      status: "error",
      message: "Database operation failed",
      error: error.message,
    });
  }
};
