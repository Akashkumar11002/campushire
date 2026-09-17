import multer from "multer";
import path from "path";

/*  Store the uploaded resume on disk inside the uploads folder,
    and give it a unique name so two students uploading "resume.pdf" don't overwrite each other
*/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueSuffix);
  },
});

// Only allow PDF files — anything else is rejected before it even touches disk
const fileFilter = (req, file, cb) => {
  const isPdfMimeType = file.mimetype === "application/pdf";
  const isPdfExtension = path.extname(file.originalname).toLowerCase() === ".pdf";

  if (isPdfMimeType || isPdfExtension) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

export default upload;