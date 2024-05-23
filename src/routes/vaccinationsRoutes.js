const express = require("express");
const {
  addVaccination,
  getVaccinations,
  getVaccinationById,
  updateVaccination,
  deleteVaccination,
} = require("../controllers/vaccinationsController");
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /vaccination:
 *   post:
 *     summary: Add a new vaccination
 *     tags: [Vaccinations]
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
 *               vaccine_name:
 *                 type: string
 *               vaccination_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Vaccination added successfully
 *       500:
 *         description: Database operation failed
 */
router.post("/vaccination", verifyToken, addVaccination);

/**
 * @swagger
 * /vaccination:
 *   get:
 *     summary: Retrieve a list of vaccinations
 *     tags: [Vaccinations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of vaccinations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vaccination'
 *       500:
 *         description: Failed to retrieve vaccinations
 */
router.get("/vaccination", verifyToken, getVaccinations);

/**
 * @swagger
 * /vaccination/{id}:
 *   get:
 *     summary: Get a vaccination by ID
 *     tags: [Vaccinations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The vaccination ID
 *     responses:
 *       200:
 *         description: A vaccination
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vaccination'
 *       404:
 *         description: Vaccination not found
 *       500:
 *         description: Failed to retrieve vaccination
 */
router.get("/vaccination/:id", verifyToken, getVaccinationById);

/**
 * @swagger
 * /vaccination/{id}:
 *   put:
 *     summary: Update a vaccination by ID
 *     tags: [Vaccinations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The vaccination ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vaccine_name:
 *                 type: string
 *               vaccination_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Vaccination updated successfully
 *       404:
 *         description: Vaccination not found
 *       500:
 *         description: Failed to update vaccination
 */
router.put("/vaccination/:id", verifyToken, updateVaccination);

/**
 * @swagger
 * /vaccination/{id}:
 *   delete:
 *     summary: Delete a vaccination by ID
 *     tags: [Vaccinations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The vaccination ID
 *     responses:
 *       200:
 *         description: Vaccination deleted successfully
 *       404:
 *         description: Vaccination not found
 *       500:
 *         description: Failed to delete vaccination
 */
router.delete("/vaccination/:id", verifyToken, deleteVaccination);

module.exports = router;
