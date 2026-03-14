import { Router } from "express";

import { burstLimiter, createResourceLimiter, updateResourceLimiter, deleteResourceLimiter } from "../middlewares/limiters/setLimiters.js";
import { validate } from "../middlewares/validate/validate.middleware.js";
import verifyLogin from "../middlewares/auth/verifyLogin.js";

import { createListSchema, updateListSchema, deleteListSchema, reorderListsSchema } from "../validations/list.schema.js";
import { fetchLists, createList, updateList, deleteList, reorderLists } from "../controllers/list.controller.js";

const router = Router();

/**
 * @swagger
 * /lists:
 *   get:
 *     summary: Fetch user lists
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lists fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/List'
 */
router.get('/', verifyLogin, fetchLists);

/**
 * @swagger
 * /lists:
 *   post:
 *     summary: Create a list
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Work
 *     responses:
 *       200:
 *         description: List created successfully
 */
router.post('/', verifyLogin, burstLimiter, createResourceLimiter, validate(createListSchema), createList);

/**
 * @swagger
 * /lists/reorder:
 *   patch:
 *     summary: Reorder lists
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               listsOrder:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     position:
 *                       type: number
 *     responses:
 *       200:
 *         description: Lists reordered successfully
 */
router.patch('/reorder', verifyLogin, validate(reorderListsSchema), reorderLists);

/**
 * @swagger
 * /lists/{id}:
 *   patch:
 *     summary: Update list
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: List ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated List
 *     responses:
 *       200:
 *         description: List updated successfully
 *       404:
 *         description: List not found
 */
router.patch('/:id', verifyLogin, burstLimiter, updateResourceLimiter, validate(updateListSchema), updateList);

/**
 * @swagger
 * /lists/{id}:
 *   delete:
 *     summary: Delete list
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: List ID
 *     responses:
 *       200:
 *         description: List deleted successfully
 *       404:
 *         description: List not found
 */
router.delete('/:id', verifyLogin, burstLimiter, deleteResourceLimiter, validate(deleteListSchema), deleteList);

export default router;