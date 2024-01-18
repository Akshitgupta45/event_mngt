const express = require("express");
const mongoose = require("mongoose");
const eventRoute = require("./router/event");
const userRoute = require("./router/user");
const authMiddleware = require("./middleware/auth");

const app = express();
const PORT = 5000;

const connectDb = async () => {
	await mongoose.connect(
		"mongodb+srv://Akshitgupta45:eefvfKJNqgXoLncM@cluster0.vljfa.mongodb.net/"
	);
};
connectDb()
	.then(() => {
		console.log("MongoDb connected Successfuly");
	})
	.catch(() => {
		console.log("Error while connecting to MongoDb");
	});

app.use(express.json());

app.use("/api/v1/event", authMiddleware, eventRoute);
app.use("/api/v1/user", userRoute);

app.listen(PORT, () => {
	console.log("server is running on port", PORT);
});
