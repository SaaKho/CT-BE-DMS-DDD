import express from "express";
import authRoutes from "./presentation/routes/authRoutes";
import documentRoutes from "./presentation/routes/documentRoutes";
import tagRoutes from "./presentation/routes/tagRoutes";
import downloadRoutes from "./presentation/routes/downloadRoutes";
import searchRoute from "./presentation/routes/searchRoute";
import permissionRoutes from "./presentation/routes/permissionRoutes";
import paginationRoutes from "./presentation/routes/paginationRoutes";

const createApp = () => {
  const app = express();

  // Middleware
  app.use(express.json());

  // Routes
  app.use("/api/users", authRoutes);
  app.use("/api/documents", documentRoutes);
  app.use("/api/tags", tagRoutes);
  app.use("/api/download", downloadRoutes);
  app.use("/api/search", searchRoute);
  app.use("/api/documents", permissionRoutes);
  app.use("/api/pagination", paginationRoutes);
  app.use("/api/permissions", permissionRoutes);

  return app;
};

export default createApp;
