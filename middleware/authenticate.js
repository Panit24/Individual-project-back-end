const { User } = require("../models");
const createError = require("../utils/createError");
const jwt = require("jsonwebtoken");
module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer")) {
      createError("you are unauthorized", 401);
    }
    const token = authorization.split(" ")[1];
    if (!token) {
      createError("you are unauthorized", 401);
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY); //verify if token is valid by checking with the server's secret key
    const user = await User.findOne({
      where: { id: payload.id },
      attributes: { exclude: ["password"] },
    });
    // console.log(user);
    if (!user) {
      createError("you are unauthorized");
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
