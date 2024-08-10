const express = require("express");
const router = express.Router();

const { fetchUserById, updateUser } = require("../controller/User");

const {
  createAppointment,
  fetchAllAppointments,
  fetchUserAppointments,
  fetchSelectedAppointment,
  addSuggestions,
  rescheduleAppointment,
} = require("../controller/UserAppointments");

router
  .patch("/:id", updateUser)
  .get("/own", fetchUserById)
  .post("/createAppointment", createAppointment)
  .get("/fetchAppointments", fetchAllAppointments)
  .get("/fetchUserAppointments", fetchUserAppointments)
  .get("/fetchSelectedAppointment/:appId", fetchSelectedAppointment)
  .post("/addSuggestions/:appId", addSuggestions)
  .post("/rescheduleAppointment/:appId", rescheduleAppointment);

exports.router = router;
