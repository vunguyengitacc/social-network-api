import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/public/pictures/");
  },
  filename: (req, file, cb) => {
    let currentDate = new Date();
    cb(null, `${currentDate.toISOString()}-${file.originalname}`);
  },
});

const filter = (req, file, cb) => {
  if (file.mimetype === "image/jpge" || file.mimetype === "image/png")
    cb(null, true);
  cb(new Error("Only image is accepted"));
};

const multerUploader = multer({
  storage: storage,
  fileFilter: filter,
});

export default multerUploader;
