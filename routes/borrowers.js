const express = require("express");
const router = express.Router();
const borrowerController = require("../controllers/BorrowerControllers");

router.post("/borrowers", borrowerController.addBorrower);
router.get("/borrowers", borrowerController.getAllBorrowers);
router.get("/borrowers/:id", borrowerController.getBorrowerById);
router.put("/borrowers/:id", borrowerController.updateBorrowerById);
router.delete("/borrowers/:id", borrowerController.deleteBorrowerById);

module.exports = router;
