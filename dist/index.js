"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const schema_1 = require("./drizzle/schema");
const authmiddleware_1 = require("./middleware/authmiddleware");
const multer_1 = __importDefault(require("multer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const drizzle_orm_1 = require("drizzle-orm");
// Set up environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(express_1.default.json());
// Route for user registration
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = await schema_1.db
            .insert(schema_1.users)
            .values({
            username,
            email,
            password: hashedPassword,
        })
            .returning();
        res
            .status(201)
            .json({ message: "User registered successfully", user: newUser });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to register user" });
    }
});
// Route for user login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await schema_1.db
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.username, username))
            .execute();
        const user = result[0];
        if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid username or password" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username }, JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to log in" });
    }
});
// Create a new document with metadata (protected by JWT)
app.post("/addDocument", authmiddleware_1.authMiddleware, async (req, res) => {
    const { title, content, metadata, author, phone } = req.body;
    try {
        const newDocument = await schema_1.db
            .insert(schema_1.documents)
            .values({
            title,
            content,
            author,
        })
            .returning();
        res.status(201).json(newDocument);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create document" });
    }
});
// Get all documents (protected by JWT)
app.get("/alldocuments", authmiddleware_1.authMiddleware, async (req, res) => {
    try {
        const allDocuments = await schema_1.db.select().from(schema_1.documents).execute();
        res.status(200).json(allDocuments);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to retrieve documents" });
    }
});
// Get a single document by ID (protected by JWT)
app.get("/documents/:id", authmiddleware_1.authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await schema_1.db
            .select()
            .from(schema_1.documents)
            .where((0, drizzle_orm_1.eq)(schema_1.documents.id, id))
            .execute();
        const document = result[0];
        if (document) {
            res.status(200).json(document);
        }
        else {
            res.status(404).json({ message: "Document not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Failed to retrieve document" });
    }
});
// Update a document by ID (protected by JWT)
app.put("/documents/:id", authmiddleware_1.authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { title, content, metadata, author } = req.body;
    try {
        const updatedDocument = await schema_1.db
            .update(schema_1.documents)
            .set({ title, content, author })
            .where((0, drizzle_orm_1.eq)(schema_1.documents.id, id))
            .returning()
            .execute();
        res.status(200).json(updatedDocument);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update document" });
    }
});
// Delete a document by ID (protected by JWT)
app.delete("/documents/:id", authmiddleware_1.authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await schema_1.db.delete(schema_1.documents).where((0, drizzle_orm_1.eq)(schema_1.documents.id, id)).execute();
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete document" });
    }
});
// Set up multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({ storage });
// Upload a document file (protected by JWT)
app.post("/upload", authmiddleware_1.authMiddleware, upload.single("file"), (req, res) => {
    res
        .status(200)
        .send({ message: "File uploaded successfully", file: req.file });
});
// Generate a short-lived download link for a file (protected by JWT)
app.get("/download/:filename", authmiddleware_1.authMiddleware, (req, res) => {
    const { filename } = req.params;
    const file = `${__dirname}/uploads/${filename}`;
    jsonwebtoken_1.default.sign({ file }, JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
        if (err)
            return res.status(500).send({ message: "Error generating token" });
        res.send({ token });
    });
});
// Endpoint to download a file with a valid token
app.get("/file/:token", (req, res) => {
    const { token } = req.params;
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
        if (err ||
            !decoded ||
            typeof decoded !== "object" ||
            !("file" in decoded)) {
            return res.status(500).send({ message: "Invalid or expired token" });
        }
        const filePath = decoded.file;
        res.download(filePath, (downloadErr) => {
            if (downloadErr) {
                return res.status(500).send({ message: "Failed to download file" });
            }
        });
    });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
