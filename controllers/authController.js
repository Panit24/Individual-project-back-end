const createError = require("../utils/createError");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

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

    const hashedRow = await User.findOne({
      where: {
        username: username,
      },
    });

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

exports.signup = async (req, res, next) => {
  try {
    const {
      name,
      branch,
      address,
      taxId,
      phoneNumber,
      username,
      password,
      confirmPassword,
    } = req.body;
    //จังหวะรับมาจาก front
    if (!phoneNumber) {
      createError("Phone number is required", 400);
    }
    if (!password) {
      createError("password is required", 400);
    }
    if (password !== confirmPassword) {
      createError("passwords not matched", 400);
    }
    if (password !== confirmPassword) {
      createError("passwords not matched", 400);
    }

    const isMobilePhone = validator.isMobilePhone(phoneNumber + "");
    if (!isMobilePhone) {
      createError("Phone number is in invalid format", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    //จังหวะเข้า db
    const user = await User.create({
      name: name,
      branch: branch,
      address: address,
      taxId: taxId,
      phoneNumber: isMobilePhone ? phoneNumber : null,
      username: username,
      password: hashedPassword,
    });
    const token = genToken({
      id: user.id,
    });
    res.status(201).json({ message: "Sign up success.", token: token });
  } catch (err) {
    next(err);
  }
};
