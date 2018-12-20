const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/dev");
const Rental = require("./models/rental");
const fakeDb = require("./fake-db");
const rentalRoutes = require("./routes/rentals");

mongoose
  .connect(
    config.DB_URI,
    { useNewUrlParser: true }
  )
  .then(() => {
    const FakeDb = new fakeDb();
    FakeDb.seeDb();
  });

const app = express();

app.use("/api/v1/rentals", rentalRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("I am running");
});
