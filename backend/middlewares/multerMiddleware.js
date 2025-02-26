const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const tempDir = path.resolve("public/temp");
    console.log("Saving file to:", tempDir); // Log the destination directory
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const uniqueFileName = `${Date.now()}-${file.originalname}`;
    console.log("Generated file name:", uniqueFileName); // Log the file name
    cb(null, uniqueFileName);
  },
});

const upload = multer({ storage });

module.exports = { upload };