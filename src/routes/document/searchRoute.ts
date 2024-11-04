// SearchRoute.ts
import express from "express";
import { SearchController } from "../../controllers/searchController";

const router = express.Router();
const searchController = new SearchController();

router.get(
  "/advancedSearch",
  searchController.advancedSearch.bind(searchController)
);

export default router;
