const express = require("express");
const {
  addHealthLog,
  getHealthLogs,
  getHealthLogById,
  updateHealthLog,
  deleteHealthLog,
} = require("../controllers/healthLogsController");
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /health-logs:
 *   post:
 *     summary: Add a new health log
 *     tags: [Health Logs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pet_id:
 *                 type: string
 *               log_date:
 *                 type: string
 *                 format: date
 *               details:
 *                 type: string
 *     responses:
 *       200:
 *         description: Health log added successfully
 *       500:
 *         description: Database operation failed
 */
router.post("/health-logs", verifyToken, addHealthLog);

/**
 * @swagger
 * /health-logs:
 *   get:
 *     summary: Retrieve a list of health logs
 *     tags: [Health Logs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of health logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HealthLog'
 *       500:
 *         description: Failed to retrieve health logs
 */
router.get("/health-logs", verifyToken, getHealthLogs);

/**
 * @swagger
 * /health-logs/{id}:
 *   get:
 *     summary: Get a health log by ID
 *     tags: [Health Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The health log ID
 *     responses:
 *       200:
 *         description: A health log
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthLog'
 *       404:
 *         description: Health log not found
 *       500:
 *         description: Failed to retrieve health log
 */
router.get("/health-logs/:id", verifyToken, getHealthLogById);

/**
 * @swagger
 * /health-logs/{id}:
 *   put:
 *     summary: Update a health log by ID
 *     tags: [Health Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The health log ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               log_date:
 *                 type: string
 *                 format: date
 *               details:
 *                 type: string
 *     responses:
 *       200:
 *         description: Health log updated successfully
 *       404:
 *         description: Health log not found
 *       500:
 *         description: Failed to update health log
 */
router.put("/health-logs/:id", verifyToken, updateHealthLog);

/**
 * @swagger
 * /health-logs/{id}:
 *   delete:
 *     summary: Delete a health log by ID
 *     tags: [Health Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The health log ID
 *     responses:
 *       200:
 *         description: Health log deleted successfully
 *       404:
 *         description: Health log not found
 *       500:
 *         description: Failed to delete health log
 */
router.delete("/health-logs/:id", verifyToken, deleteHealthLog);

module.exports = router;
