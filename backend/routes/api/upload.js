const multer = require("multer");
const storage = multer.diskStorage({
  //Specify the destination directory where the file needs to be saved
  destination: function (req, file, cb) {
    console.log("Multer");
    cb(null, "./uploads");
  },
  //Specify the name of the file. The date is prefixed to avoid overwriting of files.
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({
  storage,
  filefilter(req, files, callback) {
    const ext = path.extname(files.originalname);
    const allowed = [".png", ".jpg", ".jpeg", ".pdf", ".doc", ".mp3", ".wav"];
    if (allowed.includes(ext)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  limits: {
    fileSize: 524288000,
  },
});

module.exports = upload;
