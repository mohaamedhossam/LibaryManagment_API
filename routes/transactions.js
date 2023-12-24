const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/TransactionControlllers");

// check out a book
router.post("/checkout", transactionController.checkoutBook);

// return a book
router.put("/return", transactionController.returnBook);

// get the unreturned books by a specific borrower
router.get("/currentBooks/:borrowerId", transactionController.getCurrentBooks);

// get all overdue books currently checked out
router.get("/overdue", transactionController.getOverdueBooks);

module.exports = router;
