const { DataTypes } = require('sequelize')

const db = require('../configs/db')
const validators = require('../shared/validators')
const User = require('./user')

const Author = db.define(
  'author',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    description: {
      type: DataTypes.STRING,
      validate: {
        isNotEmptyString: validators.isNotEmptyString
      }
    }
  },
  {
    timestamps: false
  }
)

Author.belongsTo(User, {
  as: 'user',
  foreignKey: {
    name: 'userId',
    allowNull: false
  },
  onDelete: 'CASCADE'
})
User.hasOne(Author, {
  as: 'author',
  foreignKey: 'userId'
})

module.exports = Author
