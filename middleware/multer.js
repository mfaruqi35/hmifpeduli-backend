import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("File harus berupa gambar"), false);
    }
  },
});

export const uploadImages = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "documentationImages", maxCount: 10 },
  { name: "proofImage", maxCount: 1 },
]);

export default upload;
