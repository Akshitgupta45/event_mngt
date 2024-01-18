const express = require("express");
const eventController = require("../controllers/event");
const router = new express.Router();

router.post("/create", eventController.createEvent);
router.get("/list", eventController.getEvent);
router.post("/join", eventController.joinEvent);

module.exports = router;
