import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_default_jwt_secret";
const LINK_EXPIRATION = process.env.LINK_EXPIRATION || "15m";

// Service to generate a download link
export const generateDownloadLink = (filename: string) => {
  const token = jwt.sign({ filename }, JWT_SECRET, {
    expiresIn: LINK_EXPIRATION,
  });
  return token;
};

// Service to verify a token and get the file path
export const getFilePathFromToken = (token: string) => {
  const decoded = jwt.verify(token, JWT_SECRET) as { filename: string };

  let filePath = path.join(__dirname, "../../uploads", decoded.filename);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, "../../documents", decoded.filename);
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found");
    }
  }
  return filePath;
};

// Service to ensure the downloads directory exists and copy the file
export const copyFileToDownloads = (filePath: string, filename: string) => {
  const downloadsDir = path.join(__dirname, "../../downloads");
  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
  }

  const downloadFilePath = path.join(downloadsDir, filename);
  fs.copyFileSync(filePath, downloadFilePath);

  return downloadFilePath;
};
