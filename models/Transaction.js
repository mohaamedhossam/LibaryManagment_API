const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Transaction = sequelize.define("Transaction", {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  BOOK_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  BORROWER_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  BORROW_DATE: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  DUE_DATE: {
    type: DataTypes.DATE,
  },
  FLAG: {
    type: DataTypes.TINYINT,
    defaultValue: 0, // 0 means that is checked out
  },
});

module.exports = Transaction;
