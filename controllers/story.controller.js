const storyServices = require("../services/story.services");

//storyGet
const getStory = async (req, res) => {
	const userId = req.params.id;
	const resData = await storyServices.get_story(userId);
	await res.send(resData);
};

//postStory
const postStory = async (req, res) => {
	const postFile = req.file;
	const token = req.headers.authorization;
	const reqData = { token, postFile };
	const resData = await storyServices.post_story(reqData);
	await res.send(resData);
};

//export
module.exports = storyController = {
	getStory,
	postStory,
};
