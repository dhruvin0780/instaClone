const { log } = require("console");
const userServices = require("../services/user.service");

//user_registeration
const regUser = async (req, res) => {
	const reqData = req.body;

	const resData = await userServices.regUser(reqData);
	res.send(resData);
};

//user_login
const loginUser = async (req, res) => {
	const reqData = req.body;

	const resData = await userServices.loginUser(reqData);
	console.log("---->>>", resData.token);

	res.send(resData);
};

//export
module.exports = userController = {
	regUser,
	loginUser,
};
