const User = require("../models/user");

async function isAdmin(req, res, next) {
  const authenticatedUser = await User.findByPk(req.authenticatedUserId);

  if (authenticatedUser?.isAdmin) {
    next();
  } else {
    res.status(404).end();
  }
}

module.exports = isAdmin;
