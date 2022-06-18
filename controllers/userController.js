// const { User } = require("../models");
exports.getMe = async (req, res, next) => {
  try {
    const user = JSON.parse(JSON.stringify(req.user));
    res.json({ user: user, role: "user" });
  } catch (err) {
    next(err);
  }
};
