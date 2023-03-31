const jwt = require('jsonwebtoken')

function authenticateUser (req, res, next) {
  if (req.headers.authorization?.startsWith('JWT ')) {
    const token = req.headers.authorization.slice(4)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, signedData) => {
      if (error) {
        res.status(401).end()
      }

      req.userId = signedData.id
      next()
    })
  } else {
    res.status(401).end()
  }
}

module.exports = authenticateUser
