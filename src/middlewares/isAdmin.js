const User = require('../models/user')

async function isAdmin (req, res, next) {
  const user = await User.findByPk(req.userId)

  if (user?.is_admin) {
    next()
  } else {
    res.status(404).end()
  }
}

module.exports = isAdmin
