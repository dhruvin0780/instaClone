const ObjectId = require("mongodb").ObjectId;

const { object } = require("joi");
const POST = require("../models/model.post");
const MESSAGE = require("../src/MESSAGES.json");
const JWT = require("../src/token");

//get_post
const get_post = async (id, createdBy) => {
	try {
		let criteria;
		if (id) {
			criteria = {
				_id: id,
			};
		} else if (createdBy) {
			criteria = {
				createdBy: createdBy,
			};
		}

		const findPost = await POST.find(criteria);
		return {
			payload: findPost,
			message: MESSAGE.POST_FATCH,
			status: 200,
		};
	} catch (error) {
		console.log("ERROR-------------->>", error);
		return {
			payload: {},
			message: error.message,
			status: 500,
		};
	}
};

//create
const create_post = async (reqData) => {
	try {
		const { caption, postFile, token } = reqData;

		if (!postFile || !caption) {
			return {
				payload: {},
				message: MESSAGE.INVALID_PARAMETERS,
				status: 400,
			};
		} else {
			const decodedToken = await JWT.decodeToken(token);
			console.log("decod---", decodedToken);

			const createData = await POST.create({
				image_url: postFile[0].filename,
				caption: caption,
				createdBy: decodedToken.id,
				createdAt: Date.now(),
			});
			return {
				payload: createData,
				message: MESSAGE.POST_CREATE_SUCCESSFULLY,
				status: 201,
			};
		}
	} catch (error) {
		console.log("ERROR-------------->>", error);
		return {
			data: {},
			message: error.message,
			status: 500,
		};
	}
};

//like post
const like_post = async (token, postId) => {
	try {
		const decodeToken = await JWT.decodeToken(token);

		//find post
		const post = await POST.findById(postId);

		for (let i = 0; post.likes.users.length > i; i++) {
			if (post.likes.users[i]["username"] == decodeToken.userName) {
				const removeLike = await POST.findOneAndUpdate(
					{ _id: postId },
					{
						$inc: { "likes.count": -1 },
						$pull: {
							"likes.users": {
								username: decodeToken.userName,
							},
						},
					},
					{ new: true }, // Return updated document
				);
				return { payload: {}, message: "like removed!", status: 200 };
			}
		}

		const addLike = await POST.findOneAndUpdate(
			{ _id: postId },
			{
				$inc: { "likes.count": 1 },
				$push: {
					"likes.users": {
						username: decodeToken.userName,
						createdAt: new Date(),
					},
				},
			},
			{ new: true }, // Return updated document
		);

		if (!addLike) {
			return { payload: {}, message: "Post not found!", status: 404 };
		} else {
			return { payload: {}, message: "like added...", status: 201 };
		}
	} catch (error) {
		console.log("ERROR-------------->>", error);
		return {
			payload: {},
			message: error.message,
			status: 500,
		};
	}
};

//add comment
const add_comment = async (token, postId, text) => {
	try {
		const decodeToken = await JWT.decodeToken(token);

		const addComments = await POST.findOneAndUpdate(
			{ _id: postId },
			{
				$push: {
					comments: {
						text: text,
						createdBy: decodeToken.id,
						createdAt: new Date(),
					},
				},
			},
			{ new: true }, // Return updated document
		);

		if (!addComments) {
			return { payload: {}, message: "Post not found!", status: 404 };
		} else {
			return {
				payload: addComments,
				message: "comment add successfully...",
				status: 201,
			};
		}
	} catch (error) {
		console.log("ERROR-------------->>", error);
		return {
			payload: {},
			message: error.message,
			status: 500,
		};
	}
};

//delete-comments
const delete_comment = async (id, token) => {
	try {
		const decodeToken = await JWT.decodeToken(token);
		const findComment = await POST.findOneAndUpdate(
			{
				"comments._id": id,
				createdBy: decodeToken.id,
			},
			{
				$pull: {
					comments: {
						_id: id,
					},
				},
			},
			{ new: true }, // Return updated document
		);
		return {
			payload: {},
			message: "Comment delete successfully",
			status: 200,
		};
	} catch (error) {
		console.log("ERROR-------------->>", error);
		return {
			payload: {},
			message: error.message,
			status: 500,
		};
	}
};

//export
module.exports = exports = {
	create_post,
	like_post,
	add_comment,
	get_post,
	delete_comment,
};
