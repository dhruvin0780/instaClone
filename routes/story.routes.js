const express = require("express");
const storyRouter = express.Router();
const JWT = require("../src/token");

const multer = require("multer");
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./src/story");
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname.split(".")[0]);
	},
});
const upload = multer({ storage: storage });

//import-Controllers
const storyController = require("../controllers/story.controller");

//getStory
storyRouter.get("/:id", JWT.validateToken, storyController.getStory);

//postStory
storyRouter.post(
	"/",
	JWT.validateToken,
	upload.single("postFile"),
	storyController.postStory,
);
//export
module.exports = { storyRouter };
