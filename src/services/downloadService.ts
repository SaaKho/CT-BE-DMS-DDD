import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_default_jwt_secret";
const LINK_EXPIRATION = process.env.LINK_EXPIRATION || "15m";
const UPLOADS_DIR = path.join(__dirname, "../../uploads");
const DOCUMENTS_DIR = path.join(__dirname, "../../documents");
const DOWNLOADS_DIR = path.join(__dirname, "../../downloads");

// Utility function to check if a directory exists, if not, it creates it
const ensureDirectoryExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Generates a JWT-based download link for a given file
export const generateDownloadLink = (
  filename: string,
  protocol: string,
  host: string
) => {
  const token = jwt.sign({ filename }, JWT_SECRET, {
    expiresIn: LINK_EXPIRATION,
  });

  const downloadLink = `${protocol}://${host}/api/documents/download/${token}`;
  return downloadLink;
};

// Serves a file based on the provided JWT token
export const serveFileByToken = (token: string) => {
  const decoded = jwt.verify(token, JWT_SECRET) as { filename: string };

  const uploadsFilePath = path.join(UPLOADS_DIR, decoded.filename);
  const documentsFilePath = path.join(DOCUMENTS_DIR, decoded.filename);

  console.log("Decoded filename:", decoded.filename);
  console.log("Checking file in uploadsDir:", uploadsFilePath);
  console.log("Checking file in documentsDir:", documentsFilePath);

  let filePath = uploadsFilePath;
  if (!fs.existsSync(filePath)) {
    filePath = documentsFilePath;
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found");
    }
  }

  // Ensure the downloads directory exists
  ensureDirectoryExists(DOWNLOADS_DIR);

  const downloadFilePath = path.join(DOWNLOADS_DIR, decoded.filename);

  // Copy the file to the downloads directory
  fs.copyFileSync(filePath, downloadFilePath);

  console.log("File copied to downloads directory:", downloadFilePath);

  return downloadFilePath;
};
