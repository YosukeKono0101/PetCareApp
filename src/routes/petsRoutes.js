const express = require("express");
const {
  addPet,
  getPets,
  getPetDetails,
  updatePet,
  deletePet,
} = require("../controllers/petsController");
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /pets:
 *   post:
 *     summary: Add a new pet
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               gender:
 *                 type: string
 *               breed:
 *                 type: string
 *               age:
 *                 type: integer
 *               weight:
 *                 type: number
 *               birthDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Pet added successfully
 *       500:
 *         description: Database operation failed
 */
router.post("/pets", verifyToken, addPet);

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Retrieve a list of pets
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of pets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pet'
 *       500:
 *         description: Failed to retrieve pets
 */
router.get("/pets", verifyToken, getPets);

/**
 * @swagger
 * /pets/{id}:
 *   get:
 *     summary: Get a pet by ID
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The pet ID
 *     responses:
 *       200:
 *         description: A pet
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       404:
 *         description: Pet not found
 *       500:
 *         description: Failed to retrieve pet details
 */
router.get("/pets/:id", verifyToken, getPetDetails);

/**
/**
 * @swagger
 * /pets/{id}:
 *   put:
 *     summary: Update a pet by ID
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The pet ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               gender:
 *                 type: string
 *               breed:
 *                 type: string
 *               age:
 *                 type: integer
 *               weight:
 *                 type: number
 *               birthDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Pet updated successfully
 *       404:
 *         description: Pet not found
 *       500:
 *         description: Database operation failed
 */
router.put("/pets/:id", verifyToken, updatePet);

/**
 * @swagger
 * /pets/{id}:
 *   delete:
 *     summary: Delete a pet by ID
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The pet ID
 *     responses:
 *       200:
 *         description: Pet deleted successfully
 *       404:
 *         description: Pet not found
 *       500:
 *         description: Database operation failed
 */
router.delete("/pets/:id", verifyToken, deletePet);

module.exports = router;
