const { mongoose, isValidObjectId, set } = require("mongoose");
const crypto = require("crypto");
const privateKey = "DDBHESANIYA@0780?";
const USER = require("../models/model.user");
const MESSAGE = require("../src/MESSAGES.json");
const jwt = require("jsonwebtoken");

//user singup
const regUser = async (reqData) => {
	try {
		const { email, fullName, userName, password } = reqData;

		if (!email || !fullName || !userName || !password) {
			return {
				payload: {},
				message: MESSAGE.INVALID_PARAMETERS,
				status: 400,
			};
		}

		const existUser = await USER.findOne({
			userName: userName,
		});

		if (existUser) {
			return {
				payload: {},
				message: MESSAGE.USER_ALREADY_EXISTS,
				status: 400,
			};
		} else {
			const hashPass = await crypto
				.createHash("sha256")
				.update(password.toString())
				.digest("hex");

			//create query
			const createUser = await USER.create({
				email: email,
				fullName: fullName,
				userName: userName,
				password: hashPass,
			});
			if (createUser) {
				return {
					data: {},
					message: MESSAGE.USER_REGISTRATION_SUCCESS,
					status: 200,
				};
			}
		}
	} catch (error) {
		console.log("ERROR********", error);
		return {
			payload: {},
			message: MESSAGE.USER_REGISTRATION_FAILED,
			status: 500,
		};
	}
};

//user login
const loginUser = async (reqData) => {
	try {
		const { userName, password } = reqData;

		if (!userName || !password) {
			return {
				payload: {},
				message: MESSAGE.INVALID_PARAMETERS,
				status: 400,
			};
		}

		const existUser = await USER.findOne({
			userName: userName,
		});

		if (!existUser) {
			return {
				payload: {},
				message: MESSAGE.USER_NOT_EXIST,
				status: 404,
			};
		} else {
			const decodedPass = await crypto
				.createHash("sha256")
				.update(password)
				.digest("hex");

			if (existUser.password === decodedPass) {
				const updateUser = await USER.updateOne(
					{
						userName: existUser.userName,
					},
					{ $set: { isLoggedIn: true } },
				);

				return {
					payload: updateUser,
					message: MESSAGE.USER_LOGIN_SUCCESSFULLY,
					token: jwt.sign(
						{
							id: existUser._id,
							email: existUser.email,
							userName: existUser.userName,
						},
						privateKey,
						{ expiresIn: "365d" },
					),
					status: 200,
				};
			} else {
				return {
					payload: {},
					message: "Wrong password, Plz enter the right password.",
					status: 200,
				};
			}
		}
	} catch (error) {
		console.log("ERROR-------------->>", error);
		return {
			data: {},
			message: MESSAGE.USER_REGISTRATION_FAILED,
			status: 500,
		};
	}
};

//export
module.exports = userServices = {
	regUser,
	loginUser,
};
