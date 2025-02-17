const multer = require("multer")
const path = require("path"); 


// Update the path to resolve the correct absolute directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("public/temp")); // Resolves the path to avoid issues
  },
  filename: function (req, file, cb) {
    // To avoid overwriting, append Date.now() to the file name
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

module.exports = {upload}
