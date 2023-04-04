const { Sequelize } = require("sequelize");
require("sequelize-hierarchy-v6")(Sequelize);

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  }
);

module.exports = db;
