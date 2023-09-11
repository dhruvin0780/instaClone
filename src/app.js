const mongoose = require("mongoose");
const express = require("express");

const http = require("http");
const path = require("path");
const allRoute = require("../routes/main.routes");

const app = express();
const port = 8000;

app.use(express.json());

//connection
mongoose
	.connect("mongodb://localhost:27017/instaClone", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("connection succusesfully..."))
	.catch((err) => console.log(err));

//import allRoutes
app.use("/api", allRoute);

// Socket setup
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const uuid = require("uuid");
const USER = require("../src/myjs");
io.engine.generateId = (req) => {
	return uuid.v4(); // must be unique across all Socket.IO servers
};

// io.on("connection", (socket) => {
// 	console.log(`USER CONNECTED:-------> ${socket.id}`);

// 	// setTimeout(() => {
// 	// 	socket.send("Sent message from server side by prereserve event...");
// 	// }, 1000);

// 	// recive msg from client
// 	socket.on("msg_from_client", (data) => {
// 		console.log("This Message is====>" + data);

// 		//emit
// 		socket.emit("msg_from_client", data);
// 		io.emit("joinRoom", data);
// 	});

// 	// recive msg from admin
// 	socket.on("msg_from_admin", (data) => {
// 		console.log("MESSAGE IS WHAT===>", data);

// 		io.emit("msg_from_admin", data);
// 	});

// 	//create room
// 	socket.on("joinRoom", ({ name, room }, callback) => {
// 		const { error, user } = USER.addUser({ id: socket.id, name, room });
// 		console.log("------>>", user);
// 		if (error) return callback(error);

// 		// Emit will send message to the user
// 		// who had joined
// 		socket.emit("message", {
// 			user: "admin",
// 			text: `${user.name},
//             welcome to room ${user.room}.`,
// 		});

// 		// Broadcast will send message to everyone
// 		// in the room except the joined user
// 		socket.broadcast.to(user.room).emit("message", {
// 			user: "admin",
// 			text: `${user.name}, has joined`,
// 		});

// 		socket.join(user.room);

// 		io.to(user.room).emit("roomData", {
// 			room: user.room,
// 			users: USER.getUsersInRoom(user.room),
// 		});
// 		// callback();
// 	});

// 	//disconnected
// 	socket.on("disconnected", (data) => {
// 		console.log("Disconnected~~~~~~~~", data);

// 		io.emit("disconnected", data);
// 	});
// });

io.sockets.once("connection", async (socket) => {
	socket.send(
		JSON.stringify({
			type: "hello from server",
			content: [1, "2"],
		}),
	);

	//
	socket.on("room", function (room) {
		socket.join(room); // and join it

		//
		io.sockets.in(room).emit("message", {
			type: "status",
			text: "Is now connected",
			created: Date.now(),
			username: socket.id,
		});

		socket.timeout(5000).emit("message", (err, response) => {
			if (err) {
				// the other side did not acknowledge the event in the given delay
			} else {
				return {
					type: "fire",
					text: "Is send messages for connection...",
					created: Date.now(),
					username: socket.id,
				};
				console.log("---------", response);
			}
		});
		//
		socket.on("disconnect", function () {
			// Emits a status message to the connected room when a socket client is disconnected
			io.sockets.in(room).emit({
				type: "status",
				text: "disconnected",
				created: Date.now(),
				username: socket.request.user.username,
			});
		});
	});
});

//listning
server.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
