import { z } from "zod";

// Document Schema
export const documentSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  fileExtension: z.string().min(1, "File extension is required"),
  contentType: z.string().min(1, "Content type is required"),
  tags: z.union([z.string(), z.array(z.string())]).optional(), // Tags can be either a string or an array of strings
});