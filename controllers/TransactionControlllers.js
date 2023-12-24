const sequelize = require("../config/database");
const { Op } = require("sequelize");
const Transaction = require("../models/Transaction");
const Borrower = require("../models/Borrower");
const Book = require("../models/Book");

// check out a book
exports.checkoutBook = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { borrowerId, bookId } = req.body;

    // Check that borrower and book exists
    const borrower = await Borrower.findByPk(borrowerId, { transaction: t });

    if (!borrower) {
      await t.rollback();
      return res.status(400).json({ error: "Borrower not found" });
    }

    const book = await Book.findByPk(bookId, { transaction: t });

    if (!book || book.QUANTITY <= 0) {
      await t.rollback();
      return res.status(400).json({ error: "Book not available for checkout" });
    }

    // check that borrower has not already borrowed this book and doesn't return it
    const existingTransaction = await Transaction.findOne({
      where: {
        BORROWER_ID: borrowerId,
        BOOK_ID: bookId,
        FLAG: 0,
      },
      transaction: t,
    });

    if (existingTransaction) {
      await t.rollback();
      return res
        .status(400)
        .json({ error: "Borrower has already borrowed this book" });
    }

    // add 30 days on date of check out to be the due date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    await Book.update(
      { QUANTITY: book.QUANTITY - 1 },
      { where: { ISBN: bookId }, transaction: t }
    );
    const transaction = await Transaction.create(
      {
        BORROWER_ID: borrowerId,
        BOOK_ID: bookId,
        DUE_DATE: dueDate,
      },
      { transaction: t }
    );

    await t.commit();

    res
      .status(201)
      .json({ message: "Book checked out successfully", transaction });
  } catch (error) {
    console.error("Error checking out book:", error);
    await t.rollback();
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// return a book
exports.returnBook = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { bookId, borrowerId } = req.body;

    // Check if the borrower exists
    const borrower = await Borrower.findByPk(borrowerId, { transaction: t });
    if (!borrower) {
      await t.rollback();
      return res.status(404).json({ error: "Borrower not found" });
    }

    // Find the transaction record for the book and borrower
    const transaction = await Transaction.findOne({
      where: {
        BOOK_ID: bookId,
        BORROWER_ID: borrowerId,
        FLAG: 0,
      },
    });

    if (!transaction) {
      await t.rollback();
      return res
        .status(404)
        .json({ error: "Book not found or not checked out by the borrower" });
    }

    // update the flag to 1 as returned
    await transaction.update({ FLAG: 1 }, { transaction: t });

    // Update the book quantity
    await Book.update(
      { QUANTITY: sequelize.literal("QUANTITY + 1") },
      { where: { ID: bookId }, transaction: t }
    );

    await t.commit();

    res.status(200).json({ message: "Book returned successfully" });
  } catch (error) {
    console.error("Error returning book:", error);
    await t.rollback();
    res.status(500).json({ error: "Internal server error" });
  }
};

// get the unreturned books by a specific borrower
exports.getCurrentBooks = async (req, res) => {
  try {
    const borrowerId = req.params.borrowerId;

    const borrower = await Borrower.findByPk(borrowerId);

    if (!borrower) {
      return res.status(400).json({ error: "Borrower not found" });
    }

    // find the borrowed books with flag 0 of this borrower
    const borrowedBooks = await Transaction.findAll({
      where: {
        BORROWER_ID: borrowerId,
        FLAG: 0,
      },
      attributes: ["BORROW_DATE", "DUE_DATE"],
      include: [
        {
          model: Book,
          attributes: ["ISBN", "title"],
        },
      ],
    });

    res.status(200).json({ borrowedBooks });
  } catch (error) {
    console.error("Error retrieving current books:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// get all overdue books currently checked out
exports.getOverdueBooks = async (req, res) => {
  try {
    const currentDate = new Date();

    const overdueTransactions = await Transaction.findAll({
      where: {
        DUE_DATE: {
          [Op.lt]: currentDate, // lt "less than"
        },
        FLAG: 0,
      },
      include: [
        {
          model: Book,
          attributes: ["ISBN", "title", "author"],
        },
        {
          model: Borrower,
          attributes: ["id", "name", "email"],
        },
      ],
    });

    res.json({ overdueTransactions });
  } catch (error) {
    console.error("Error retrieving overdue books:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
