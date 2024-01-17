const mongoose = require("mongoose");

const attendeeSchema = new mongoose.Schema({
	eventId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "events",
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
	},
});

const Attendee = mongoose.model("attendees", attendeeSchema);
module.exports = Attendee;
