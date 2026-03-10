import multer from "multer";
import path from "path";
import crypto from "crypto";

export const upload = multer({
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, "..", "tmp", "uploads"),

    filename: (req, file, callback) => {
      // Gera um nome único para evitar arquivos duplicados
      const fileHash = crypto.randomBytes(16).toString("hex");
      const fileName = `${fileHash}-${file.originalname}`;
      callback(null, fileName);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB máximo
  },
  fileFilter: (req, file, callback) => {
    // Aceita apenas PDF e DOCX
    const allowedMimes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Apenas arquivos PDF e DOCX são permitidos"));
    }
  }
});