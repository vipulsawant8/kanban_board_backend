import { Schema, Types, model } from "mongoose";

const taskSchema = new Schema({

	authorID: {

		type: Types.ObjectId,
		ref: "User",
		require: true
	},

	listID: {

		type: Types.ObjectId,
		ref: "List",
		require: true
	},
	
	title: {
		
		type: String,
		require: true,
		trim: true,
		minLength: 1,
		// lowercase: true
	},
	
	description: {
		
		type: String,
		default: "",
		trim: true,
		// lowercase: true
	},

	position: {

		type: Number,
		require: true
	}
}, {
	timestamps: true
});

taskSchema.index({ title: 1, authorID: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });

taskSchema.methods.toJSON = function () {

	const task = this.toObject();
	delete task.__v;
	return task;
};

const Task = model('Task', taskSchema);

export default Task;