import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/public/pictures/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${new Date().toISOString().replace(/:/g, "-")}-${file.originalname}`
    );
  },
});

const filter = (req, file, cb) => {
  if (file.mimetype === "image/jpge" || file.mimetype === "image/png")
    cb(null, true);
  else cb(new Error("Only image is accepted"));
};

const multerUploader = multer({
  storage: storage,
  fileFilter: filter,
});

export default multerUploader;
