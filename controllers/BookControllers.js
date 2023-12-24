const { Op } = require("sequelize");
const Book = require("../models/Book");

const addBook = async (req, res) => {
  try {
    const { title, author, quantity, shelf_location } = req.body;

    if (!title || !author || !quantity || !shelf_location) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newBook = await Book.create({
      title,
      author,
      quantity,
      shelf_location,
    });

    res.status(201).json({
      message: "Book created successfully",
      bookId: newBook.ISBN,
    });
  } catch (error) {
    console.error(error);

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({ error: error.errors[0].message });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const allBooks = await Book.findAll();

    res.status(200).json(allBooks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateBookById = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { title, author, quantity, shelf_location } = req.body;

    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    if (!title && !author && !quantity && !shelf_location) {
      return res
        .status(400)
        .json({ error: "At least one field is required for update" });
    }

    if (title) {
      book.title = title;
    }

    if (author) {
      book.author = author;
    }

    if (quantity) {
      book.quantity = quantity;
    }

    if (shelf_location) {
      book.shelf_location = shelf_location;
    }

    await book.save();

    res.status(200).json({ message: "Book updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const searchBooks = async (req, res) => {
  try {
    const { title, author, ISBN } = req.query;

    // Build the Sequelize conditions based on provided parameters
    const conditions = {};

    if (title) {
      conditions.title = { [Op.like]: `%${title}%` };
    }

    if (author) {
      conditions.author = { [Op.like]: `%${author}%` };
    }

    if (ISBN) {
      conditions.ISBN = ISBN;
    }

    // Find books based on the conditions
    const books = await Book.findAll({ where: conditions });

    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteBookById = async (req, res) => {
  try {
    const bookId = req.params.id;

    // Find the book based on the provided ID
    const book = await Book.findByPk(bookId);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Delete the book
    await book.destroy();

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addBook,
  getAllBooks,
  updateBookById,
  searchBooks,
  deleteBookById,
};
