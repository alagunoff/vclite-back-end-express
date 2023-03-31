const { DataTypes } = require('sequelize')

const db = require('../configs/db')
const validators = require('../shared/validators')

const User = db.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      arg: true,
      msg: 'already taken'
    },
    validate: {
      notNull: {
        msg: 'cannot be empty'
      },
      isString: validators.isString
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'cannot be empty'
      },
      isString: validators.isString
    }
  },
  first_name: {
    type: DataTypes.STRING,
    validate: {
      isString: validators.isString
    }
  },
  last_name: {
    type: DataTypes.STRING,
    validate: {
      isString: validators.isString
    }
  },
  image: {
    type: DataTypes.STRING
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    validate: {
      isBoolean: validators.isBoolean
    }
  }
}, {
  updatedAt: false,
  createdAt: 'created_at'
})

module.exports = User
