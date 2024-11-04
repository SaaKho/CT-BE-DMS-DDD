"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagController = void 0;
class TagController {
    static setTagService(service) {
        _a.tagService = service;
    }
}
exports.TagController = TagController;
_a = TagController;
TagController.addNewTag = async (req, res) => {
    const { documentId } = req.params;
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: "'name' is required." });
    }
    try {
        const updatedDocument = await _a.tagService.addNewTag({
            documentId,
            tagName: name,
        });
        res.status(200).json({
            message: "Tag added successfully",
            document: updatedDocument,
        });
    }
    catch (error) {
        console.error("Error adding new tag:", error);
        res.status(500).json({ error: "Failed to add new tag" });
    }
};
TagController.updateTag = async (req, res) => {
    const { documentId } = req.params;
    const { oldName, newName } = req.body;
    if (!oldName || !newName) {
        return res.status(400).json({
            error: "'oldName' and 'newName' are required.",
        });
    }
    try {
        const updatedDocument = await _a.tagService.updateTag({
            documentId,
            oldTagName: oldName,
            newTagName: newName,
        });
        res.status(200).json({
            message: "Tag updated successfully",
            document: updatedDocument,
        });
    }
    catch (error) {
        console.error("Error updating tag:", error);
        res.status(500).json({ error: "Failed to update tag" });
    }
};
TagController.deleteTag = async (req, res) => {
    const { documentId } = req.params;
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: "'name' is required." });
    }
    try {
        const updatedDocument = await _a.tagService.deleteTag({
            documentId,
            tagName: name,
        });
        res.status(200).json({
            message: "Tag deleted successfully",
            document: updatedDocument,
        });
    }
    catch (error) {
        console.error("Error deleting tag:", error);
        res.status(500).json({ error: "Failed to delete tag" });
    }
};
