import { Router } from "express";

import verifyLogin from "../middlewares/auth/verifyLogin.js";
import { burstLimiter, createResourceLimiter, updateResourceLimiter, deleteResourceLimiter } from "../middlewares/limiters/setLimiters.js";

import sanitizeBody from "../middlewares/sanitize/sanitize.middleware.js";

import { validate } from "../middlewares/validate/validate.middleware.js";
import { createTaskSchema, updateTaskSchema, deleteTaskSchema, reorderTasksSchema } from "../validations/task.schema.js";

import { fetchTasks, createTask, updateTask, deleteTask, reorderTasks } from "../controllers/task.controller.js";

const router = Router();

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Fetch user tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tasks fetched successfully
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
 *                     $ref: '#/components/schemas/Task'
 */
router.get('/', verifyLogin, sanitizeBody, fetchTasks);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create task
 *     tags: [Tasks]
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
 *               - listID
 *             properties:
 *               title:
 *                 type: string
 *                 example: Buy groceries
 *               description:
 *                 type: string
 *                 example: Milk, Eggs, Bread
 *               listID:
 *                 type: string
 *                 example: 65f2a4c9b91234abcd567890
 *     responses:
 *       200:
 *         description: Task created successfully
 */
router.post('/', verifyLogin, burstLimiter, createResourceLimiter, sanitizeBody, validate(createTaskSchema), createTask);

/**
 * @swagger
 * /api/tasks/reorder:
 *   patch:
 *     summary: Reorder tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tasksOrder:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     listID:
 *                       type: string
 *                     position:
 *                       type: number
 *     responses:
 *       200:
 *         description: Tasks reordered successfully
 */
router.patch('/reorder', verifyLogin, sanitizeBody, validate(reorderTasksSchema), reorderTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   patch:
 *     summary: Update task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Task
 *               description:
 *                 type: string
 *                 example: Updated description
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 */
router.patch('/:id', verifyLogin, burstLimiter, updateResourceLimiter, sanitizeBody, validate(updateTaskSchema), updateTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
router.delete('/:id', verifyLogin, burstLimiter, deleteResourceLimiter, sanitizeBody, validate(deleteTaskSchema), deleteTask);

export default router;