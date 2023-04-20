const { DataTypes } = require("sequelize");

const db = require("../configs/db");
const validators = require("../shared/validators");

const Tag = db.define(
  "tag",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        arg: true,
        msg: "already taken",
      },
      validate: {
        notNull: {
          msg: "required",
        },
        isNotEmptyString: validators.isNotEmptyString,
      },
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Tag;
