const User = require("../model/user");
const bcrypt = require("bcrypt");
const logger = require("../utils/logger");
const Jwt = require("jsonwebtoken");
const validateRegistration = require("../validation/register");
const express = require("express");
const jwtKey = "event-mngt";

const registerUser = async (req, res) => {
	const err = validateRegistration(req.body);
	if (err.hasError) {
		res.status(400).send({
			success: false,
			message: err.message,
		});
	}
	const userDetails = {
		name: req.body.name,
		email: req.body.email,
	};

	const plainTextPassword = req.body.password;

	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(plainTextPassword, salt);
	userDetails.password = hashPassword;
	// console.log(userDetails);

	let user = new User(userDetails);

	user = await user.save();
	res.send({
		success: true,
		message: "User registered successfuly",
		result: user,
	});
};
const loginUser = async (req, res) => {
	//validation can also be done similar like registration
	const email = req.body.email;
	const plainTextPassword = req.body.password;

	const user = await User.findOne({
		email: email,
	});
	if (user) {
		const isPasswordValid = await bcrypt.compare(
			plainTextPassword,
			user.password
		);
		// console.log(isPasswordValid);
		if (isPasswordValid) {
			const payload = {
				email: user.email,
				_id: user._id,
				exp: Math.floor(Date.now() / 1000 + 3600),
			};
			const token = Jwt.sign(payload, jwtKey);
			// console.log(token);
			await User.findByIdAndUpdate(user._id, {
				token: token,
			});
			logger.info("LOGIN_SUCCESSFUL", {
				timestamp: new Date(),
				email: user.email,
			});
			res.send({
				success: true,
				message: "Login successful",
				token: token,
			});
		} else {
			logger.info("LOGIN_FAILURE", {
				timestamp: new Date(),
				reason: "User does not have correct password " + email,
			});
			res.status(400).send({
				success: false,
				message: "Incorrect Username or Password",
			});
		}
	} else {
		logger.info("LOGIN_FAILURE", {
			timestamp: new Date(),
			reason: "User does not exist with Id " + email,
		});
		res.status(400).send({
			success: false,
			message: "No such user found",
		});
	}
};

const logoutUser = async (req, res) => {
	console.log("req.user", req.headers.authorization);
	const decodedToken = Jwt.decode(req.headers.authorization);
	// console.log("decodedToken", decodedToken);
	const user = await User.findByIdAndUpdate(decodedToken._id, { token: "" });
	// console.log("user", user);
	logger.info("LOGOUT_SUCCESSFUL", {
		timestamp: new Date(),
		reason: "User has been logout " + decodedToken.email,
	});
	res.send({
		success: true,
		message: "User logout Successfuly",
	});
};

module.exports = { registerUser, loginUser, logoutUser };
