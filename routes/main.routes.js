const express = require("express");
const allRoute = express.Router();

//user
allRoute.use("/user", require("../routes/user.routes").userRouter);

//userPost
allRoute.use("/user/post", require("../routes/post.routes").postRouter);

//story
allRoute.use("/user/story", require("../routes/story.routes").storyRouter);

//export
module.exports = exports = allRoute;
