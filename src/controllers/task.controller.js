import asyncHandler from 'express-async-handler';
import logger from "../utils/logger.js";

import Task from '../models/task.model.js';
import ApiError from '../utils/ApiError.js';
import ERRORS from '../constants/errors.js';

const fetchTasks = asyncHandler( async (req, res) => {
	const user = req.user;
	
		req.log.info(
			{ userId: user._id },
			"Fetch Tasks request"
		);

	const tasks = await Task.find({ authorID: user._id }).lean();
	
	req.log.debug(
		{ userId: user._id, resultCount: tasks.length },
		"Tasks fetched successfully"
	);

	return res.status(200).json({
		message: "Tasks fetched successfully",
		data: tasks,
		success: true
	})
} );

const createTask = asyncHandler( async (req, res) => {
	const user = req.user;

	const title = req.body.title?.trim();
	const listID = req.body.listID;
	const description = req.body.description?.trim();

	req.log.info(
		{ userId: user._id, title, listID, description },
		"Create task attempt"
	);

	const count = await Task.countDocuments({ authorID: user._id, listID });
	const newTask = await Task.create({ title, description, position: count, listID, authorID: user._id });

	req.log.info(
		{ userId: user._id, taskId: newTask._id },
		"Task created successfully"
	);

	return res.status(200).json({
		message: `Task "${newTask.title}" was created`,
		data: newTask,
		success: true
	});
} );

const updateTask = asyncHandler( async (req, res) => {
	const user = req.user;
	const taskID = req.params.id;

	const title = req.body.title?.trim();
	const description = req.body.description?.trim();

	req.log.info(
		{ userId: user._id, title, taskID, description },
		"Update task attempt"
	);

	const task = await Task.findOneAndUpdate({ authorID: user._id, _id: taskID }, { title, description }, { new: true }).lean();
	if (!task) throw new ApiError(404, ERRORS.TASK_NOT_FOUND);

	req.log.info(
		{ userId: user._id, taskId: task._id },
		"Task updateded successfully"
	);

	return res.status(200).json({
		message: `Task "${task.title}" was updated`,
		data: task,
		success: true
	});
} );

const deleteTask = asyncHandler( async (req, res) => {
	const user = req.user;
	const taskID = req.params.id;

	req.log.info(
		{ userId: user._id, taskID },
		"Delete task attempt"
	);
	
	const task = await Task.findOneAndDelete({ _id: taskID, authorID: user._id }).lean();
	if (!task) throw new ApiError(404, ERRORS.TASK_NOT_FOUND);

	req.log.info(
		{ userId: user._id, taskId: task._id },
		"Task deleted successfully"
	);

	return res.status(200).json({
		message: `Task "${task.title}" was deleted`,
		data: task,
		success: true
	});
} );

const reorderTasks = asyncHandler( async (req, res) => {
	const user = req.user;
	const { tasksOrder } = req.body;

	req.log.info(
		{ userId: user._id, tasksOrder },
		"Reorder task attempt"
	);

	const bulk = tasksOrder.map(t => ( {
		updateOne: {
			filter: { _id: t._id, authorID: user._id },
			update: {
				listID: t.listID,
				position: t.position
			},
		},
	} ))	

	if (bulk.length > 0) {
		
		await Task.bulkWrite(bulk);
	}
	
	const updatedTasks = await Task.find({ authorID: user._id }).sort({ listID: 1, position: 1 }).lean();

	req.log.info(
		{ userId: user._id, updatedTasks },
		"Task Reorder successfully"
	);

	const response = { message: "Reordered", success: true, data: updatedTasks };
	return res.status(200).json(response);
} );

export { fetchTasks, createTask, updateTask, deleteTask, reorderTasks };