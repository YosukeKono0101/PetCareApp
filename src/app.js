const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const petsRoutes = require("./routes/petsRoutes");
const healthLogsRoutes = require("./routes/healthLogsRoutes");
const vaccinationsRoutes = require("./routes/vaccinationsRoutes");
const swaggerDefinition = require("./config/swaggerDefinition");

// Load environment variables
dotenv.config();
// Create an Express application
const app = express();
app.use(express.json());

// Enable CORS with default options
app.use(cors());

// Swagger API documentation
const swaggerOptions = {
  swaggerDefinition,
  apis: ["./src/routes/*.js"],
};

// Initialize Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);
// Serve the Swagger API documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Define the routes
app.use(authRoutes);
app.use(petsRoutes);
app.use(healthLogsRoutes);
app.use(vaccinationsRoutes);

module.exports = app;
