const bcrypt = require("bcrypt");
const File = require("../models/file");

// render homepage
module.exports.home = (_, res) => {
  return res.render("home");
};

// file upload
module.exports.upload = async (req, res) => {
  const fileData = {
    path: req.file.path,
    originalName: req.file.originalname,
  };

  if (req.body.password != null && req.body.password !== "") {
    fileData.password = await bcrypt.hashSync(req.body.password, 10);
  }

  const file = await File.create(fileData);

  return res.render("home", {
    fileName: file.originalName,
    fileLink: `${req.headers.origin}/file/${file.id}`,
  });
};
