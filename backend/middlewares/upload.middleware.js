import multer from "multer";
// this is the multer middleware
// Keep the image in memory before sending it to Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;
