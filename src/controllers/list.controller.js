import asyncHandler from 'express-async-handler';
import logger from "../utils/logger.js";

import List from '../models/list.model.js';
import ApiError from '../utils/ApiError.js';
import Task from '../models/task.model.js';
import ERRORS from '../constants/errors.js';

const fetchLists = asyncHandler( async (req, res) => {

	const user = req.user;

	req.log.info(
		{ userId: user._id },
		"Fetch lists request"
	);
	const lists = await List.find({ authorID: user._id }).sort({ position: 1 }).lean();
	
	req.log.debug(
		{ userId: user._id, resultCount: lists.length },
		"Lists fetched successfully"
	);

	return res.status(200).json({ message: "Lists fetched successfully", data: lists, success: true });
} );

const createList = asyncHandler( async (req, res) => {

	const user = req.user;
	const title = req.body.title?.trim();

	req.log.info(
		{ userId: user._id, title },
		"Create list attempt"
	);

	const count = await List.countDocuments({ authorID: user._id });
	const newList = await List.create({ authorID: user._id, title, position: count });

	req.log.info(
		{ userId: user._id, listId: newList._id },
		"List created successfully"
	);

	return res.status(200).json({ message: `List "${newList.title}" was created`, data: newList, success: true });
} );

const updateList = asyncHandler( async (req, res) => {

	const user = req.user;
	const listID = req.params.id;

	const title = req.body.title?.trim();

	req.log.info(
		{ userId: user._id, title, listID },
		"Update list attempt"
	);
	
	const list = await List.findOneAndUpdate({ _id: listID, authorID: user._id }, { title }, { new: true, runValidators: true });
	if (!list) throw new ApiError(404, ERRORS.LIST_NOT_FOUND);

	req.log.info(
		{ userId: user._id, listId: list._id },
		"List updateded successfully"
	);

	return res.status(200).json({
		message: `List "${list.title}" was updated`,
		data: list,
		success: true
	});
} );

const deleteList = asyncHandler( async (req, res) => {

	const user = req.user;
	const listID = req.params.id;

	req.log.info(
		{ userId: user._id, listID },
		"Delete list attempt"
	);

	const list = await List.findOneAndDelete({ _id: listID, authorID: user._id });
	if (!list) throw new ApiError(404, ERRORS.LIST_NOT_FOUND);

	req.log.info(
		{ userId: user._id, listId: list._id },
		"List deleted successfully"
	);
	
	await Task.deleteMany({ listID: list._id, authorID: user._id });
	
	return res.status(200).json({
		message: `List "${list.title}" and its associated tasks were deleted`,
		data: list,
		success: true
	});
} );

const reorderLists = asyncHandler( async (req, res) => {
	const user = req.user;

	const { listsOrder } = req.body;

	req.log.info(
		{ userId: user._id, listsOrder },
		"Reorder list attempt"
	);

	const bulk = listsOrder.map(l => ( {
		updateOne: {
			filter: { _id: l._id, authorID: user._id },
			update: {
				position: l.position
			},
		},
	} ));

	if (bulk.length > 0) {
		
		await List.bulkWrite(bulk);
	}

	const updatedLists = await List.find({ authorID: user._id }).sort({ position: 1 }).lean();

	req.log.info(
		{ userId: user._id, updatedLists },
		"List Reorder successfully"
	);

	const response = { message: "Reordered", success: true, data: updatedLists };
	return res.status(200).json(response);
});

export { fetchLists, createList, updateList, deleteList, reorderLists };