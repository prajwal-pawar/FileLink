const bcrypt = require("bcrypt");
const fs = require("fs");
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

  // delete file after 10 minutes interval
  setTimeout(async () => {
    // delete file from uploads/ folder
    await fs.unlink(file.path, (err) => {
      if (err) {
        console.log(err);
        return;
      }
    });
    // delete file from db
    await File.deleteOne({ _id: file._id });
    console.log(`File ${file.originalName} deleted.`);
  }, 10 * 60 * 1000);

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
