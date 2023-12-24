const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config/database");
const booksRouter = require("./routes/books");
const borrowersRouter = require("./routes/borrowers");
const transactionsRouter = require("./routes/transactions");

const app = express();

app.use(bodyParser.json());

sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
    require("./models/associations")(sequelize);

    app.use(borrowersRouter);
    app.use(booksRouter);
    app.use(transactionsRouter);

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });
