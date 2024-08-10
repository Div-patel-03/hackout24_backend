const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    birthDetail: { type: Object, default: {} },
    password: { type: Buffer, required: true },
    role: { type: String, required: true, default: "user" },
    name: { type: String },
    DOB: { type: String },
    firstName: { type: String, required: true },
    profilePic: { type: String, required: true,unique: true},
    lastName: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: String },
    phoneNumber: { type: String, required: true },
    whatsappNumber: { type: String, required: true },
    salt: Buffer,
    resetPasswordToken: { type: String, default: "" },
    appointments: { type: [Schema.Types.Mixed], default: [] },

  },
  { timestamps: true, minimize: false }
);

const virtual = userSchema.virtual("id");
virtual.get(function () {
  return this._id;
});

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.User = mongoose.model("u_001_users", userSchema);
