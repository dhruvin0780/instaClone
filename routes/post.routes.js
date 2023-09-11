const express = require("express");
const postRouter = express.Router();
const JWT = require("../src/token");
const multer = require("multer");
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./src/uploads"); // Uploads will be stored in the 'uploads' directory
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname); // Set a unique filename
	},
});
const upload = multer({ storage: storage });

//import-userController
const postController = require("../controllers/post.controller");
const { required } = require("joi");

//getAllPost
postRouter.get("/", postController.getPost);

//creat post
postRouter.post(
	"/",
	JWT.validateToken,
	upload.array("postFile", 10),
	postController.createPost,
);

//like post
postRouter.patch("/:id/like", JWT.validateToken, postController.likePost);

//addComments
postRouter.put("/:id/comment", JWT.validateToken, postController.addComment);

//deleteComment
postRouter.delete(
	"/:id/comment",
	JWT.validateToken,
	postController.deleteComment,
);
//export
module.exports = { postRouter };
