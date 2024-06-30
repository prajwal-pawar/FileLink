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

// file download
module.exports.download = async (req, res) => {
  const file = await File.findById(req.params.id);

  if (file.password != null) {
    if (req.body.password == null) {
      res.render("password", {
        filename: file.originalName,
      });
      return;
    }

    const password = await bcrypt.compareSync(req.body.password, file.password);

    if (!password) {
      return res.render("password", {
        error: true,
      });
    }
  }

  file.downloadCount++;
  await file.save();

  return res.download(file.path, file.originalName);
};
