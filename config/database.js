const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "mysql",
  host: "localhost",
  username: "root",
  password: "12345678",
  database: "bookmanagment",
});

module.exports = sequelize;
