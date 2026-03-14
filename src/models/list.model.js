import { Schema, Types, model } from "mongoose";

const listSchema = new Schema({
	
	title: {
		
		type: String,
		require: true,
		trim: true,
		minLength: 1,
		// lowercase: true
	},
	
	authorID: {

		type: Types.ObjectId,
		ref: "User",
		require: true
	},

	position: {

		type: Number,
		require: true
	}
}, { timestamps: true });

listSchema.index({ authorID: 1, title: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

listSchema.methods.toJSON = function () {

	const list = this.toObject();
	delete list.__v;
	return list;
};
const List = model('List', listSchema);

export default List;