const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

// Verify the token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // Check if the token is provided
  if (!authHeader) {
    return res
      .status(403)
      .send({ status: "error", message: "No token provided" });
  }

  // Check if the token is valid
  const token = authHeader.split(" ")[1];
  // Check if the token is provided
  if (!token) {
    return res
      .status(403)
      .send({ status: "error", message: "No token provided" });
  }

  // Verify the token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    // Check if the token is valid
    if (err) {
      return res.status(401).send({ status: "error", message: "Unauthorized" });
    }
    // Set the userId in the request object
    req.userId = decoded.userId;
    next();
  });
};

module.exports = verifyToken;
