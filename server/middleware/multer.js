import multer from "multer";
import path from "path";

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    let fileName =
      path.basename(file.originalname) +
      "_" +
      Date.now() +
      path.extname(file.originalname);
    cb(null, fileName);
    return fileName;
  },
});

const imageUpload = multer({
  storage: imageStorage,
  async fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error("Please upload a Image"));
    }

    cb(undefined, true);
  },
});

export { imageUpload };
