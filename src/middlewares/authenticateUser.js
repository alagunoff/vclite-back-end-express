const jwt = require("jsonwebtoken");

function authenticateUser(responseStatus = 401) {
  return function (req, res, next) {
    if (req.headers.authorization?.startsWith("JWT ")) {
      const token = req.headers.authorization.slice(4);

      try {
        req.authenticatedUserId = jwt.verify(token, process.env.JWT_SECRET_KEY);
        next();
      } catch {
        res.status(responseStatus).end();
      }
    } else {
      res.status(responseStatus).end();
    }
  };
}

module.exports = authenticateUser;
