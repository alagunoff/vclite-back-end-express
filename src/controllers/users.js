const jwt = require("jsonwebtoken");

const { createErrorsObject } = require("../shared/utils/errors");
const { saveUserImageToStaticFiles } = require("../shared/utils/users");
const User = require("../models/user");

async function createUser(req, res) {
  const user = User.build({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    image: req.body.image,
  });

  try {
    await user.validate();

    if (user.image) {
      await user.save({
        fields: ["username", "password", "firstName", "lastName"],
        validate: false,
      });

      user.image = req.body.image;
      user.image = saveUserImageToStaticFiles(user);
    }

    await user.save({ validate: false });

    res.status(201).send(jwt.sign(user.id, process.env.JWT_SECRET_KEY));
  } catch (error) {
    res.status(400).json(createErrorsObject(error));
  }
}

async function getUser(req, res) {
  const authenticatedUser = await User.findByPk(req.authenticatedUserId, {
    attributes: {
      exclude: ["password"],
    },
  });

  if (authenticatedUser) {
    if (authenticatedUser.image) {
      authenticatedUser.image = `http://localhost:3000/static/images/users/${authenticatedUser.image}`;
    }

    res.json(authenticatedUser);
  } else {
    res.status(404).end();
  }
}

async function deleteUser(req, res) {
  const userToDelete = await User.findByPk(req.params.id);

  if (userToDelete) {
    await userToDelete.destroy();

    res.status(204).end();
  } else {
    res.status(404).end();
  }
}

module.exports = {
  createUser,
  getUser,
  deleteUser,
};
