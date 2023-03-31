const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

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

    user.password = bcrypt.hashSync(user.password)

    if ('image' in req.body) {
      try {
        user.image = await saveUserImageOnDisk(user.username, user.image)
      } catch {
        res.status(500).end()
      }
    }

    await user.save({ validate: false })

    res.status(201).send(jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET))
  } catch (error) {
    res.status(400).json(transformErrorsArrayToObject(error.errors))
  }
}

async function getUser (req, res) {
  const user = await User.findByPk(req.userId)

  res.json(user)
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
