const express = require("express");
const db = require("./configs/mongoose");

const app = express();

const PORT = 8000;

// start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
