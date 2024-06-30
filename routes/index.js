const express = require("express");
const router = express.Router();

const upload = require("../configs/multer");
const homeController = require("../controllers/home_controller");

router.get("/", homeController.home);

router.post("/upload", upload.single("file"), homeController.upload);

module.exports = router;
