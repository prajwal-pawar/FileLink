const mongoose = require("mongoose");

const mongoUrl = "mongodb://localhost/filelink";

mongoose.connect(mongoUrl);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error starting mongodb"));
db.once("open", () => {
  console.log("connected to mongodb");
});

module.exports = db;
