import { Container } from "inversify";
import { DocumentService } from "../application/services/documentService";
import { ConsoleLogger } from "../infrastructure/logging/consoleLogger";
import { IDocumentRepository } from "../domain/interfaces/IDocument.Repository";
import { IUserRepository } from "../domain/interfaces/IUser.Repository";
import { DocumentRepository } from "../infrastructure/repository/documentRepository";
import { UserRepository } from "../infrastructure/repository/userRepository";
import { JwtAuthHandler } from "../infrastructure/auth/handlers/JWTAuthHandler";
import { AuthMiddleware } from "../presentation/middleware/authMiddleware";
import { DownloadService } from "../application/services/downloadService";
import { DownloadController } from "../presentation/controllers/downloadController";
import { SearchService } from "../application/services/searchService";
import { SearchController } from "../presentation/controllers/searchController";
import { PermissionsService } from "../domain/services/permissionService";
import { PermissionsController } from "../presentation/controllers/permissionController";
import { TagService } from "./../application/services/tagService";
import { TagController } from "../presentation/controllers/tagController";
import { PaginationService } from "../application/services/paginationService";
import { Logger } from "../infrastructure/logging/logger";
import { PaginationController } from "../presentation/controllers/paginationController";

const container = new Container();

// Bind repositories
container
  .bind<IDocumentRepository>("IDocumentRepository")
  .to(DocumentRepository);
container.bind<IUserRepository>("IUserRepository").to(UserRepository);

// Bind services
container.bind<ConsoleLogger>("Logger").to(ConsoleLogger);
container.bind<DocumentService>("DocumentService").to(DocumentService);
container.bind<DownloadService>("DownloadService").to(DownloadService);
container.bind<SearchService>("SearchService").to(SearchService);
container.bind<PermissionsService>("PermissionsService").to(PermissionsService);

// Bind controllers
container.bind<DownloadController>("DownloadController").to(DownloadController);
container.bind<SearchController>("SearchController").to(SearchController);
container
  .bind<PermissionsController>("PermissionsController")
  .to(PermissionsController);

// Bind auth handlers and middleware
container.bind<JwtAuthHandler>("JwtAuthHandler").to(JwtAuthHandler);
container.bind<AuthMiddleware>("AuthMiddleware").to(AuthMiddleware);

container
  .bind<PaginationService>("PaginationService")
  .toDynamicValue((context) => {
    const logger = context.container.get<Logger>("Logger");
    const documentRepository = context.container.get<IDocumentRepository>(
      "IDocumentRepository"
    );
    const userRepository =
      context.container.get<IUserRepository>("IUserRepository");
    return new PaginationService(logger, documentRepository, userRepository);
  });

// Bind PaginationController with PaginationService injected
container
  .bind<PaginationController>("PaginationController")
  .toDynamicValue((context) => {
    const paginationService =
      context.container.get<PaginationService>("PaginationService");
    return new PaginationController(paginationService);
  });

container.bind<TagService>("TagService").toDynamicValue((context) => {
  const documentRepository = context.container.get<IDocumentRepository>(
    "IDocumentRepository"
  );
  const logger = context.container.get<Logger>("Logger");
  return new TagService(documentRepository, logger);
});

// Bind the TagController, with TagService injected
container.bind<TagController>("TagController").toDynamicValue((context) => {
  const tagService = context.container.get<TagService>("TagService");
  return new TagController(tagService);
});

export { container };
