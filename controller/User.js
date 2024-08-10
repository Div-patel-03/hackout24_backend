const { User } = require("../model/User");

const crypto = require("crypto");

const jwt = require("jsonwebtoken");

exports.fetchUserById = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findById(id);

    user.imageUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: bucketName,
        Key: user.profilePic,
      }),
      { expiresIn: 360000 }
    );

    res.status(200).json({
      id: user.id,
      appointments: user.appointments,
      gender: user.gender,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      role: user.role,
    });
  } catch (err) {
    console.log("err:", err);
    res.status(400).json(err);
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};
