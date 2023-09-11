const mongoose = require("mongoose");
const validatePost = require("./joi.validation/validate.post");

const postSchema = new mongoose.Schema(
	{
		// id: "string",
		image_url: { type: String, required: true },

		caption: { type: String, default: null },

		likes: {
			count: { type: Number, default: 0 },
			users: [
				{
					username: { type: String },
					createdAt: { type: Date },
				},
			],
		},

		comments: [
			{
				text: String,
				createdBy: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User", // Reference to the User model for the author of the story
					required: true,
				},
				createdAt: { type: Date },
			},
		],

		createdAt: { type: Date },

		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
		},

		updatedAt: { type: Date },
	},
	{ timestamp: true },
);

//pre
postSchema.pre("save", async function (next) {
	const data = this.toObject();

	try {
		await validatePost(data);
		next();
	} catch (error) {
		console.log("ERROR------>>", error);
		next(error);
	}
});

//
const POST = mongoose.model("POST", postSchema);
module.exports = POST;
