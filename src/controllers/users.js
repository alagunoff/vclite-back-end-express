const { saveUserImageOnDisk, transformErrorsArrayToObject } = require('../shared/utils');
const User = require('../models/user');

exports.create_user = async (req, res) => {
  const image_path = await saveUserImageOnDisk(req.body.username, req.body.image)

  User.create({
    username: req.body.username,
    password: req.body.password,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    image: image_path,
    is_admin: req.body.is_admin,
  })
    .then(() => {
      res.status(201).end();
    })
    .catch((error) => {
      res.status(400).json(transformErrorsArrayToObject(error.errors));
    });
}

exports.getUsers = (req, res, next) => {
  User.findAll()
    .then(users => {
      res.status(200).json({ users: users });
    })
    .catch(err => console.log(err));
}

exports.getUser = (req, res, next) => {
  const userId = req.params.userId;
  User.findByPk(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }
      res.status(200).json({ user: user });
    })
    .catch(err => console.log(err));
}

exports.updateUser = (req, res, next) => {
  const userId = req.params.userId;
  const updatedName = req.body.name;
  const updatedEmail = req.body.email;
  User.findByPk(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }
      user.name = updatedName;
      user.email = updatedEmail;
      return user.save();
    })
    .then(result => {
      res.status(200).json({ message: 'User updated!', user: result });
    })
    .catch(err => console.log(err));
}

exports.deleteUser = (req, res, next) => {
  const userId = req.params.userId;
  User.findByPk(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }
      return User.destroy({
        where: {
          id: userId
        }
      });
    })
    .then(result => {
      res.status(200).json({ message: 'User deleted!' });
    })
    .catch(err => console.log(err));
}