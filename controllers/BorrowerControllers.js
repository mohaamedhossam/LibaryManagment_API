const Borrower = require("../models/Borrower");
const { validate } = require("email-validator");
const { Op } = require("sequelize");

//add a new borrower
exports.addBorrower = async (req, res) => {
  try {
    const { name, email } = req.body;

    const isEmailValid = Borrower.build({ name, email });
    await isEmailValid.validate();

    const newBorrower = await Borrower.create({ name, email });
    res.status(201).json({ borrowerId: newBorrower.id });
  } catch (error) {
    console.error(error);

    if (error.name === "SequelizeValidationError" || "ValidationErrorItem") {
      return res.status(400).json({ error: error.errors[0].message });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};

//get all borrowers
exports.getAllBorrowers = async (req, res) => {
  try {
    const borrowers = await Borrower.findAll();
    res.status(200).json(borrowers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//get a borrower by ID
exports.getBorrowerById = async (req, res) => {
  try {
    const borrowerId = req.params.id;
    const borrower = await Borrower.findByPk(borrowerId);

    if (!borrower) {
      return res.status(404).json({ error: "Borrower not found" });
    }

    res.status(200).json(borrower);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//update a borrower by ID
exports.updateBorrowerById = async (req, res) => {
  try {
    const borrowerId = req.params.id;
    const { name, email } = req.body;
    const borrower = await Borrower.findByPk(borrowerId);

    if (!borrower) {
      return res.status(404).json({ error: "Borrower not found" });
    }

    if (email && !validate(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }
    // Check if the email is already used by another borrower
    const existingBorrowerWithEmail = await Borrower.findOne({
      where: { email, id: { [Op.not]: borrowerId } },
    });

    if (existingBorrowerWithEmail) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    if (name) {
      borrower.name = name;
    }

    if (email) {
      borrower.email = email;
    }
    await borrower.save();

    res.status(200).json({ message: "Borrower updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//delete a borrower by ID
exports.deleteBorrowerById = async (req, res) => {
  try {
    const borrowerId = req.params.id;
    const borrower = await Borrower.findByPk(borrowerId);

    if (!borrower) {
      return res.status(404).json({ error: "Borrower not found" });
    }

    await borrower.destroy();

    res.status(200).json({ message: "Borrower deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
