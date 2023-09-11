io.on("connection", (socket) => {
	console.log("A user connected");

	socket.on("joinRoom", (room) => {
		socket.join(room);
		console.log(`User joined room: ${room}`);
	});

	socket.on("leaveRoom", (room) => {
		socket.leave(room);
		console.log(`User left room: ${room}`);
	});

	socket.on("disconnect", () => {
		console.log("A user disconnected");
	});
});
