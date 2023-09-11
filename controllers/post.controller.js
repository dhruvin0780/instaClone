const postServices = require("../services/post.services");

//get post
const getPost = async (req, res) => {
	const { id, createdBy } = req.query;
	const resData = await postServices.get_post(id, createdBy);
	await res.send(resData);
};

//create post
const createPost = async (req, res) => {
	const postFile = req.files;
	const token = req.headers.authorization;
	const reqData = { ...req.body, token, postFile };

	const resData = await postServices.create_post(reqData);
	await res.send(resData);
};

//like the post
const likePost = async (req, res) => {
	const postId = req.params.id;
	const token = req.headers.authorization;

	const resData = await postServices.like_post(token, postId);
	await res.send(resData);
};

//comment on the post
const addComment = async (req, res) => {
	const postId = req.params.id;
	const text = req.body.text;
	const token = req.headers.authorization;

	const resData = await postServices.add_comment(token, postId, text);
	await res.send(resData);
};

//delete comment
const deleteComment = async (req, res) => {
	const id = req.params.id;
	const token = req.headers.authorization;
	const resData = await postServices.delete_comment(id, token);
	await res.send(resData);
};
//export
module.exports = { createPost, likePost, addComment, getPost, deleteComment };
