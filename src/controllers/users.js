const { ValidationError } = require("sequelize");
const jwt = require("jsonwebtoken");

const { createErrorsObject } = require("../shared/utils/errors");
const { getImageUrl } = require("../shared/utils/images");
const User = require("../models/user");

async function createUser(req, res) {
  try {
    const createdUser = await User.create(req.body);

    res.status(201).send(jwt.sign(createdUser.id, process.env.JWT_SECRET_KEY));
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
  try {
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
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
}

async function deleteUser(req, res) {
  try {
    const userToDelete = await User.findByPk(req.params.id);

    if (userToDelete) {
      try {
        await userToDelete.destroy();

        res.status(204).end();
      } catch (error) {
        console.log(error);

        res.status(500).end();
      }
    } else {
      res.status(404).end();
    }
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
}

module.exports = {
  createUser,
  getUser,
  deleteUser,
};
