const { mongoose, isValidObjectId, set } = require("mongoose");
const crypto = require("crypto");
const privateKey = "DDBHESANIYA@0780?";
const STORY = require("../models/model.story");
const MESSAGE = require("../src/MESSAGES.json");
const jwt = require("jsonwebtoken");
const JWT = require("../src/token");
const { log } = require("console");
const { object } = require("joi");
const { on } = require("events");
var ObjectId = require("mongodb").ObjectId;

//story services
const post_story = async (reqData) => {
	try {
		const { postFile, token } = reqData;
		const decodeToken = await JWT.decodeToken(token);
		var resData = {};
		//find story
		const findStory = await STORY.findOne({ author: decodeToken.id });
		if (findStory) {
			await STORY.updateOne(
				{
					author: decodeToken.id,
				},
				{
					$push: {
						content: [
							{
								title: postFile.filename,
							},
						],
					},
				},
			).then(() => {
				resData = {
					payload: {},
					message: "added story successfully...",
				};
			});
		} else {
			await STORY.create({
				content: [
					{
						title: postFile.filename,
					},
				],
				author: decodeToken.id,
			}).then(() => {
				resData = {
					payload: {},
					message: "created successfully...",
				};
			});
		}

		return resData;
	} catch (error) {
		console.log("ERROR********", error);
		return {
			payload: {},
			message: "getting err... ",
			status: 500,
		};
	}
};

//get_story
const get_story = async (userId) => {
	try {
		const resData = await STORY.find({ author: userId });
		const currentTime = Date.now() / 1000; // Convert to seconds
		console.log("resData===>>", resData);

		for (const story of resData[0].content) {
			const storyTimestamp = story.createdAt.getTime() / 1000;
			// console.log(`Deleted story with ID: ${story._id}`);

			// Check if the story is older than 24 hours
			if (currentTime - storyTimestamp >= 86400) {
				await STORY.findByIdAndUpdate(
					{
						author: userId,
					},
					{
						$pull: {
							content: {
								_id: story._id,
							},
						},
					},
					{ new: true },
					(err, updatedDoc) => {
						if (err) {
							console.log("err===>>", err);
						} else {
							console.log("updatedDoc===>>", updatedDoc);
						}
					},
				);
			}
		}

		const finalResData = await STORY.find({ author: userId });
		return {
			payload: finalResData[0].content,
			message: "get story successfully...",
			status: 200,
		};
	} catch (error) {
		console.log("error===>>", error);
		return {
			payload: {},
			message: `ERROR...${error}`,
			status: 500,
		};
	}
};

//export
module.exports = storyServices = {
	post_story,
	get_story,
};
