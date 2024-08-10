const express = require("express");

const router = express.Router();
const passport = require("passport");
const {
  createAvailability,
  fetchAvailability,
  manageSlots,
  fetchAllUsers,
} = require("../controller/Admin");

router
  .post("/createAvailability", createAvailability)
  .get("/fetchAvailability", fetchAvailability)
  .post("/manageSlots", manageSlots)
  .get("/fetchAllUSers", fetchAllUsers);

exports.router = router;
