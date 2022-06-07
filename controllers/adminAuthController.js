const createError = require("../utils/createError");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Admin } = require("../models");

const genToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username) {
      createError("username is required", 400);
    }
    if (!password) {
      createError("password is required", 400);
    }

    const hashedRow = await Admin.findOne({
      where: {
        username: username,
      },
    });
    console.log(hashedRow);

    if (!hashedRow) {
      createError("Invalid username or password", 401);
    }
    hashedPasswordFromDb = hashedRow.password;
    const result = await bcrypt.compare(password, hashedPasswordFromDb);
    if (result) {
      // console.log("password correct");
      const token = genToken({
        id: hashedRow.id,
      });
      res.status(201).json({
        message: "log in success.",
        token: token,
      });
    } else {
      createError("Invalid username or password", 401);
    }
  } catch (err) {
    next(err);
  }
};
