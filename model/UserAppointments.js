const mongoose = require("mongoose");
const { Schema } = mongoose;

const userAppointments = new Schema(
  {
    birthDetails: { type: [Schema.Types.Mixed], required: true },
    type: { type: String, required: true },
    slot: { type: Object, required: true },
    date: { type: String, required: true },
    status: { type: String, default: "Pending" },
    userId: { type: String, required: true },
  },
  { timestamps: true, minimize: false }
);

const virtual = userAppointments.virtual("id");
virtual.get(function () {
  return this._id;
});

userAppointments.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.UserAppointments = mongoose.model(
  "u_002_appointments",
  userAppointments
);
