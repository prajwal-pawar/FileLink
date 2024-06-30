const express = require("express");
const db = require("./configs/mongoose");

const app = express();

const PORT = 8000;

// body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "./views");

// routes
app.use("/", require("./routes"));

// start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
