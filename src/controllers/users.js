const { ValidationError } = require("sequelize");
const jwt = require("jsonwebtoken");

const { createErrorsObject } = require("../shared/utils/errors");
const {
  saveImageToStaticFiles,
  getImageUrl,
} = require("../shared/utils/images");
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

    if (req.body.image) {
      await user.save({
        fields: ["username", "password", "firstName", "lastName"],
        validate: false,
      });

      user.image = saveImageToStaticFiles(
        req.body.image,
        "users",
        user.username
      );
    }

    await user.save({ validate: false });

    res.status(201).send(jwt.sign(user.id, process.env.JWT_SECRET_KEY));
  } catch (error) {
    console.log(error);

    if (error instanceof ValidationError) {
      res.status(400).json(createErrorsObject(error));
    } else {
      res.status(500).end();
    }
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
      authenticatedUser.image = getImageUrl("users", authenticatedUser.image);
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
