const { UserAppointments } = require("../model/UserAppointments.js");

exports.createAppointment = async (req, res) => {
  try {
    const userAppointment = new UserAppointments(req.body);
    await userAppointment.save();
    res.status(201).send(userAppointment);
  } catch (error) {
    console.log("error while creating appointment:", error);
    res.status(400).send(error);
  }
};

exports.fetchAllAppointments = async (req, res) => {
  try {
    const appointments = await UserAppointments.find({});
    res.status(200).send(appointments);
  } catch (error) {
    console.log("error while fetching appointments:", error);
    res.status(400).send(error);
  }
};

exports.fetchUserAppointments = async (req, res) => {
  const { id } = req.user;
  try {
    const appointments = await UserAppointments.find({ userId: id });
    res.status(200).send(appointments);
  } catch (error) {
    console.log("error while fetching appointments:", error);
    res.status(400).send(error);
  }
};

exports.fetchSelectedAppointment = async (req, res) => {
  const { appId } = req.params;
  const { id } = req.user;
  console.log("req.user", req.user);
  try {
    const [appointment] = await (
      await UserAppointments.find({ userId: id })
    ).filter((appointment) => appointment.id == appId);
    console.log("appointment:", appointment);
    res.status(200).send(appointment);
  } catch (error) {
    console.log("error while fetching appointments:", error);
    res.status(400).send(error);
  }
};

exports.addSuggestions = async (req, res) => {
  const { appId } = req.params;
  const { person, remedies } = req.body;

  try {
    const [appointment] = await UserAppointments.find({ _id: appId });

    if (!appointment) {
      return res.status(404).send({ message: "Appointment not found" });
    }

    appointment.suggestions = { person, remedies };

    await appointment.save();

    res.status(200).send(appointment);
  } catch (error) {
    console.log("Error while updating appointment:", error);
    res.status(400).send(error);
  }
};

exports.rescheduleAppointment = async (req, res) => {
  console.log("req.params:", req.params);
  const { appId } = req.params;
  console.log("appId:", appId);
  console.log("req.body", req.body);
  try {
    const appointment = await UserAppointments.findOne({ _id: appId });
    if (!appointment) {
      return res.status(404).send({ message: "Appointment not found" });
    }
    console.log("appointment:", appointment);

    Object.assign(appointment, { ...appointment, ...req.body });

    await appointment.save();
    console.log("appointment after updating:", appointment);

    // Send the updated appointment as the response
    res.status(200).send(appointment);
  } catch (error) {
    console.log("Error while rescheduling appointment:", error);
    res.status(400).send(error);
    git;
  }
};
