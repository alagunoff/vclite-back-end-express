const jwt = require("jsonwebtoken");

const User = require("../models/user");

function authenticateUser(responseStatus = 401) {
  return function (req, res, next) {
    if (req.headers.authorization?.startsWith("JWT ")) {
      const token = req.headers.authorization.slice(4);

      try {
        req.authenticatedUserId = jwt.verify(token, process.env.JWT_SECRET_KEY);
        next();
      } catch (error) {
        console.log(error);

        res.status(responseStatus).end();
      }
    } else {
      res.status(responseStatus).end();
    }
  };
}

async function isAdmin(req, res, next) {
  try {
    const authenticatedUser = await User.findByPk(req.authenticatedUserId);

    if (authenticatedUser?.isAdmin) {
      next();
    } else {
      res.status(404).end();
    }
  } catch (error) {
    console.log(error);

    res.status(404).end();
  }
}

module.exports = {
  authenticateUser,
  isAdmin,
};
