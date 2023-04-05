const { DataTypes } = require("sequelize");

const db = require("../configs/db");
const validators = require("../shared/validators");
const User = require("./user");

const Author = db.define(
  "author",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING,
      validate: {
        isNotEmptyString: validators.isNotEmptyString,
      },
    },
  },
  {
    timestamps: false,
  }
);

Author.belongsTo(User, {
  as: "user",
  foreignKey: {
    allowNull: false,
  },
});
User.hasOne(Author, {
  onDelete: "CASCADE",
});

module.exports = Author;
