exports.getAdmin = async (req, res, next) => {
  try {
    const user = JSON.parse(JSON.stringify(req.admin));
    res.json({ user: user, role: 'admin' });
  } catch (err) {
    next(err);
  }
};
