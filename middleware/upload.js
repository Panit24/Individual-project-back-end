const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
//Multer is a node.js middleware for handling multipart/form-data,
// which is primarily used for uploading files

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log(file);
    cb(null, "publicBoss/images");
  },
  filename: (req, file, cb) => {
    // cb(null, file.originalname);
    cb(null, uuidv4() + "." + file.mimetype.split("/")[1]);
  },
});
//A media type (also known as a Multipurpose Internet Mail Extensions or MIME type) indicates the nature and format of a document,
// file, or assortment of bytes.
module.exports = multer({ storage: storage });
