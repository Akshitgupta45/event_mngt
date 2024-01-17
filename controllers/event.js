const Event = require("../model/event");
const Attendee = require("../model/attendee");

const createEvent = async (req, res) => {
	// console.log(req.body);
	const event = new Event(req.body);
	let result = await event.save();
	res.send({
		success: true,
		message: "Event created Successfuly",
		result: result,
	});
};
const getEvent = async (req, res) => {
	const params = req.query;
	console.log(params.searchKey);
	const queryObject = {
		name: {
			$regex: new RegExp(params.searchKey),
			$options: "i",
		},
	};
	const event = await Event.find(queryObject);
	res.send({
		success: true,
		result: event,
	});
	// const event = await Event.find({});
	// res.send({
	// 	success: true,
	// 	result: event,
	// });
};
const joinEvent = async (req, res) => {
	// console.log(req.body);
	// console.log(req.user);
	const alreadyJoined = await Attendee.findOne({
		eventId: req.body.eventId,
		userId: req.user._id,
	});
	// console.log(alreadyJoined);
	if (alreadyJoined) {
		return res.send({
			success: false,
			message: "User has already joined the event",
		});
	}
	const attendee = new Attendee({
		eventId: req.body.eventId,
		userId: req.user._id,
	});
	await attendee.save();
	res.send({
		success: true,
		message: "Successfuly joined the event",
	});
};

module.exports = {
	createEvent,
	getEvent,
	joinEvent,
};
