const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		trim: true,
		lowercase: true,
		validate: {
			validator: function (v) {
				return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
			},
			message: "Please enter a valid email",
		},
		required: [true, "Email required"],
	},

	fullName: { type: String, required: true },

	userName: { type: String, required: true },

	password: { type: String, required: true },

	isLoggedIn: { type: Boolean, default: false },
});

const USER = mongoose.model("USER", userSchema);

module.exports = USER;
