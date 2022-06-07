require("dotenv").config({ path: "../.env" });
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Admin } = require("../models");
// const genToken = (payload) =>
//   jwt.sign(payload, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//     secretOrKey: process.env.JWT_SECRET_KEY,
//   });
const genToken = (payload) => {
  console.log(process.env.JWT_SECRET_KEY);
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createAdmin = async () => {
  const username = "admin6.123";
  const password = "123456";
  const hashedPassword = await bcrypt.hash(password, 12);
  const admin = await Admin.create({
    username: username,
    password: hashedPassword,
  });
  const token = genToken({
    id: admin.id,
  });
  console.log(token);
};
createAdmin();
