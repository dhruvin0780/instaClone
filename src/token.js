const jwt = require("jsonwebtoken");
const crypto = require("crypto");

//validate the token
async function validateToken(req, res, next) {
	const token = req.headers.authorization;

	if (!token) {
		return res.status(401).json({
			error: true,
			message: "Access-token is missing",
			status: 401,
		});
	}
	next();
}

//hash password
async function hashPassWord(passwords) {
	return await crypto
		.createHash("sha256")
		.update(passwords.toString())
		.digest("hex");
}

//decode the token
async function decodeToken(token) {
	return await JSON.parse(
		Buffer.from(token.split(".")[1], "base64").toString(),
	);
}

module.exports = JWT = { validateToken, decodeToken, hashPassWord };
