const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const User = require('../models/user')

async function login(req, res) {
  const user = await User.findOne({ where: { username: req.body.username } })

  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      res.send(jwt.sign(user.id, process.env.JWT_SECRET_KEY))
    } else {
      res.status(400).send('invalid password')
    }
  } else {
    res.status(404).end()
  }
}

module.exports = {
  login
}