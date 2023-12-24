const express = require("express");
const router = express.Router();
const bookController = require("../controllers/BookControllers");

router.post("/books", bookController.addBook);
router.get("/books", bookController.getAllBooks);
router.put("/books/:id", bookController.updateBookById);
router.get("/books/search", bookController.searchBooks);
router.delete("/books/:id", bookController.deleteBookById);

module.exports = router;
