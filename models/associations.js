module.exports = (sequelize) => {
  sequelize.models.Transaction.belongsTo(sequelize.models.Book, {
    foreignKey: "BOOK_ID",
  });
  sequelize.models.Transaction.belongsTo(sequelize.models.Borrower, {
    foreignKey: "BORROWER_ID",
  });
  sequelize.models.Book.hasMany(sequelize.models.Transaction, {
    foreignKey: "BOOK_ID",
  });
  sequelize.models.Borrower.hasMany(sequelize.models.Transaction, {
    foreignKey: "BORROWER_ID",
  });
};
