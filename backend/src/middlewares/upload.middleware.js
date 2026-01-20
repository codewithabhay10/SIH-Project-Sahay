import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Configure Cloudinary from env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage that chooses resource_type based on mimetype (pdfs -> raw, images -> image)
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const isPdf = file.mimetype === "application/pdf";
    return {
      folder: "proposals",
      resource_type: isPdf ? "raw" : "image",
      public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`,
    };
  },
});

// Accept only pdfs and images
const fileFilter = (req, file, cb) => {
  const allowed = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Unsupported file type"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
});

// Export middleware helpers
const uploadSupportingDocs = upload.array("supporting_documents", 10);

export { uploadSupportingDocs };
