const Jwt = require("jsonwebtoken");
const User = require("../model/user");
const jwtKey = "event-mngt";
const authMidlleware = async (req, res, next) => {
	// Check1: Check if headers contain token or not
	const token = req.headers.authorization;
	if (!token) {
		return res.status(400).send({
			success: false,
			message: "Please provide token with headers",
		});
	}

	// Check2: Check for the token is verified or not.
	try {
		Jwt.verify(token, jwtKey);
	} catch (err) {
		return res.send({
			success: false,
			message: "Invalid Jwt",
		});
	}
	// Check3: Check the expiry of the token
	const decodedToken = Jwt.decode(token);
	const now = Math.floor(Date.now() / 1000);
	if (now > decodedToken.exp) {
		//token has expired
		return res.send({
			success: false,
			message: "Token is expired",
		});
	}

	//Check4: Check whether the token matches with user or not
	const user = await User.findById(decodedToken._id);
	// console.log(user);
	if (user.token != token) {
		return res.send({
			success: false,
			message: "Token is not verified with user",
		});
	}
	req.user = user;
	next();
};
module.exports = authMidlleware;
