const jwt = require('jsonwebtoken')

const { saveUserImageOnDisk, transformErrorsArrayToObject } = require('../shared/utils')
const User = require('../models/user')

async function createUser (req, res) {
  const user = User.build({
    username: req.body.username,
    password: req.body.password,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    image: req.body.image,
    is_admin: req.body.is_admin
  })

  try {
    await user.validate()

    if (user.image) {
      await user.save({ validate: false, fields: ['username', 'password', 'first_name', 'last_name', 'is_admin'] })
      user.image = req.body.image
      user.image = saveUserImageOnDisk(user)
      await user.save({ validate: false })
    } else {
      await user.save({ validate: false })
    }

    res.status(201).send(jwt.sign(user.id, process.env.JWT_SECRET_KEY))
  } catch (error) {
    console.log(error)
    res.status(400).json(transformErrorsArrayToObject(error.errors))
  }
}

async function getUser (req, res) {
  const user = await User.findByPk(req.userId)

  res.json({
    id: user.id,
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    image: user.image,
    is_admin: user.is_admin,
    created_at: user.created_at
  })
}

// exports.getUser = (req, res, next) => {
//   const userId = req.params.userId;
//   User.findByPk(userId)
//     .then(user => {
//       if (!user) {
//         return res.status(404).json({ message: 'User not found!' });
//       }
//       res.status(200).json({ user: user });
//     })
//     .catch(err => console.log(err));
// }

// exports.updateUser = (req, res, next) => {
//   const userId = req.params.userId;
//   const updatedName = req.body.name;
//   const updatedEmail = req.body.email;
//   User.findByPk(userId)
//     .then(user => {
//       if (!user) {
//         return res.status(404).json({ message: 'User not found!' });
//       }
//       user.name = updatedName;
//       user.email = updatedEmail;
//       return user.save();
//     })
//     .then(result => {
//       res.status(200).json({ message: 'User updated!', user: result });
//     })
//     .catch(err => console.log(err));
// }

// exports.deleteUser = (req, res, next) => {
//   const userId = req.params.userId;
//   User.findByPk(userId)
//     .then(user => {
//       if (!user) {
//         return res.status(404).json({ message: 'User not found!' });
//       }
//       return User.destroy({
//         where: {
//           id: userId
//         }
//       });
//     })
//     .then(result => {
//       res.status(200).json({ message: 'User deleted!' });
//     })
//     .catch(err => console.log(err));
// }

module.exports = {
  createUser,
  getUser
}
