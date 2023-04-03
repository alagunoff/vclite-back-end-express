const jwt = require('jsonwebtoken')

const { saveUserImageOnDisk, createErrorsObject } = require('../shared/utils')
const User = require('../models/user')

async function createUser (req, res) {
  const user = User.build({
    username: req.body.username,
    password: req.body.password,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    image: req.body.image
  })

  try {
    await user.validate()

    if (user.image) {
      await user.save({ fields: ['username', 'password', 'first_name', 'last_name'], validate: false })
      user.image = req.body.image
      user.image = saveUserImageOnDisk(user)
    }

    await user.save({ validate: false })
    res.status(201).send(jwt.sign(user.id, process.env.JWT_SECRET_KEY))
  } catch (error) {
    res.status(400).json(createErrorsObject(error))
  }
}

async function getUser (req, res) {
  const user = await User.findByPk(req.userId)

  if (user) {
    res.json({
      id: user.id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      image: user.image && `http://localhost:3000/static/images/users/${user.image}`,
      is_admin: user.is_admin,
      created_at: user.created_at
    })
  } else {
    res.status(404).end()
  }
}

async function deleteUser (req, res) {
  const user = await User.findByPk(req.params.id)
  await user.destroy()

  res.status(204).end()
}

module.exports = {
  createUser,
  getUser,
  deleteUser
}
