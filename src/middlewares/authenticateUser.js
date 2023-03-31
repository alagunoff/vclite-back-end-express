const jwt = require('jsonwebtoken')

function authenticateUser(req, res, next) {
  if (req.headers.authorization?.startsWith('JWT ')) {
    const token = req.headers.authorization.slice(4)

    try {
      req.userId = jwt.verify(token, process.env.JWT_SECRET_KEY)
      next()
    } catch (error) {
      res.status(401).end()
    }
  } else {
    res.status(401).end()
  }
}

module.exports = authenticateUser
