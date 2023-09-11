const express = require("express");
const userRouter = express.Router();
const JWT = require("../src/token");

//import-Controllers
const userController = require("../controllers/user.controller");

//register-user
userRouter.post("/signup", userController.regUser);

//login-user
userRouter.post("/login", userController.loginUser);

//chat
userRouter.get("/data", (req, res) => {
	const { room } = req.body;
	console.log("------", room);
	// Emit a message to the user who just joined the room
	io.to(room).emit("message", "Welcome to the room!");

	res.json({ message: `Joined room: ${room}` });
});

module.exports = { userRouter };
