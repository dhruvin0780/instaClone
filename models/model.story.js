const mongoose = require("mongoose");

// Define the User Story Schema
const userStorySchema = new mongoose.Schema({
	// title: {
	// 	type: String,
	// 	required: true,
	// },
	content: [
		{
			title: { type: String },
			createdAt: {
				type: Date,
				default: Date.now,
			},
		},
	],
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User", // Reference to the User model for the author of the story
		required: true,
	},
});

// Create the User Story model
const UserStory = mongoose.model("UserStory", userStorySchema);

module.exports = UserStory;
