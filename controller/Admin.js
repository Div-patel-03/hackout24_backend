const { AdminAvailability } = require("../model/Admin");
const { UserAppointments } = require("../model/UserAppointments");
const { User } = require("../model/User");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);


exports.createAvailability = async (req, res) => {
  try {
    const previous = await AdminAvailability.find();
    console.log("previous:", previous);
    if (previous) {
      await AdminAvailability.deleteMany({ day: req.body.day });  
    }

    const availability = new AdminAvailability(req.body);
    await availability.save();
    res.status(201).send(availability);
  } catch (error) {
    console.log("error create availability:", error);
    res.status(400).send(error);
  }
};

exports.fetchAvailability = async (req, res) => {
  try {
    const availability = await AdminAvailability.find();
    res.status(200).send(availability);
  } catch (error) {
    console.log("error fetch availability:", error);
    res.status(400).send(error);
  }
};

exports.manageSlots = async (req, res) => {
  const { date } = req.body;
  const day = dayjs(date).format("dddd");
  try {
    const availability = await AdminAvailability.findOne({ day });
    const half = availability.slots;
    const full = availability.hour;
    const booked = await UserAppointments.find({ date });

    const halfBookedIndexes = [];
    const fullBookedIndexes = [];

    const updatedHalf = half.map((slot, index) => {
      const bookedIndex = booked.findIndex(
        (book) => slot.time === book.slot.time
      );
      if (bookedIndex !== -1) {
        halfBookedIndexes.push(index);
        return {
          ...slot,
          isBooked: true,
        };
      } else {
        return slot;
      }
    });

    const updatedFull = full
      .map((slot, index) => {
        const bookedIndex = booked.findIndex(
          (book) => slot.time === book.slot.time
        );
        if (bookedIndex !== -1) {
          fullBookedIndexes.push(index);
          return {
            ...slot,
            isBooked: true,
          };
        } else {
          return slot;
        }
      })
      .map((slot, index) => {
        if (
          halfBookedIndexes.includes(2 * index) ||
          halfBookedIndexes.includes(2 * index + 1)
        ) {
          return {
            ...slot,
            isBooked: true,
          };
        } else {
          return slot;
        }
      });

    fullBookedIndexes?.forEach((index) => {
      const baseIndex = index * 2;
      updatedHalf[baseIndex].isBooked = true;
      updatedHalf[baseIndex + 1].isBooked = true;
    });

    console.log("fullBookedIndexes:", fullBookedIndexes);
    console.log("halfBookedIndexes:", halfBookedIndexes);

    res.status(200).send({ updatedHalf, updatedFull });
  } catch (error) {
    console.log("error managing slots:", error);
    res.status(400).send(error);
  }
};

exports.fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    console.log("error fetching all users:", error);
    res.status(400).send(error);
  }
};
