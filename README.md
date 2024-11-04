# CT-BE-DMS-DDD

In Week 1 of the Document Management System (DMS) project, we laid the groundwork for a secure and functional document management platform, using a monolithic architecture to streamline development and maintainability at this early stage. The primary goal for this week was to implement basic CRUD operations, allowing for document creation, retrieval, updating, and deletion, along with the ability to upload documents with associated metadata. This metadata management was crucial, as we aimed to allow updates to document attributes without requiring re-uploads, which enhances the flexibility and efficiency of our system.

We prioritized security and user access control by implementing JWT-based authentication, ensuring only authorized users can access protected endpoints. This approach is reinforced by role-based access control (RBAC), allowing us to differentiate permissions between Admin and User roles. We also created endpoints for managing permissions and generating short-lived download links for document files, providing controlled, time-limited access to documents as an added layer of security.

Another focus was on making our document search functionality robust and versatile. We designed advanced search filters, enabling users to search based on tags and specific metadata. This adds significant utility to the DMS by allowing users to quickly locate documents based on relevant criteria.

From a technical perspective, we followed best practices to ensure a scalable and maintainable codebase. As recommended, we used async-await for all asynchronous operations, enhancing code readability and minimizing callback complexities. We opted for Drizzle ORM to handle database interactions, integrating seamlessly with our chosen database to simplify CRUD operations. Furthermore, instead of relying on database-generated IDs, we generated UUIDs at the application level to ensure unique and consistent identifiers for documents across the system.

To ensure data integrity and prevent errors, we validated all inputs using Zod. This ensured that every request to our endpoints met expected data requirements, particularly for document metadata, permissions, and user roles. Additionally, we incorporated authentication middleware within Express to handle user login, allowing us to centralize authentication and session management.

To maintain a structured and organized development process, we strictly adhered to the Gitflow branching model, which provided a clear workflow for feature development, testing, and release. This approach included creating branches such as feature/_ for new features, develop for the integration of ongoing work, release/_ for preparing updates, and hotfix/\* for urgent fixes. Additionally, we visualized the Software Development Lifecycle (SDLC) using a custom Gitflow diagram in FigJam, which provides a clear overview of our development stages and branch flow, helping to keep the entire team aligned on the process.

Overall, Week 1 focused on establishing a secure, efficient, and well-structured foundation for the DMS. By leveraging a monolithic approach, we ensured that all functionality and dependencies remained centralized, simplifying development at this initial stage. This architecture will allow us to iterate rapidly, adding new features and refining existing ones as we move through future phases


Refactor Phase 1 (Week 2)
In Week 2, we refactored the Document Management System (DMS) codebase to incorporate principles from the 12-Factor App methodology. This refactoring effort focused on ensuring the DMS adhered to best practices for scalable, maintainable, and cloud-ready applications.

Our primary focus areas for this phase were:

12-Factor Principles: We adapted features related to Codebase, Dependencies, and Configuration management to align with the 12-Factor App guidelines. This included modularizing the code and isolating dependencies to enhance the flexibility and portability of the system.

Service Layer Abstraction: To separate concerns, we moved the business logic out of controllers and into dedicated service classes. This restructuring ensures that controllers remain lean, only handling request/response data, while services manage business logic, enhancing code readability and testability.

Monad and Railway-Oriented Programming: To improve error handling and control flow, we implemented Monad and Railway Pattern concepts. This allows us to generate intelligent exception messages, providing better debugging insights and simplifying flow control.

Repository Pattern for Data Abstraction: By abstracting away the ORM model, we created a physical store-like API using the repository pattern. This structure defines repository interfaces for each store, with concrete implementations interacting with our ORM (Drizzle) models. This refactoring allows us to swap databases (e.g., Oracle, SQL Server, MongoDB, BigTable) without altering the core business logic.

Dependency Injection (DI) for Logging: To make the logging system modular and easily configurable, we implemented DI for logging. This approach allows us to inject different loggers across services and components, providing a consistent and flexible logging strategy.

Pagination and Collection Handling: We standardized pagination options and designed a paginatedCollections output format, allowing for efficient data retrieval and display for large datasets.


## Phase 3: Entity Separation, Factory Pattern, and Process Abstraction

In Week 3, we focused on further refining the architecture and ensuring the system adheres to 12-Factor App principles and clean architecture best practices. This phase emphasizes encapsulating entities and separating business logic from external dependencies, making the system both modular and testable.

Key improvements and tasks in this phase included:

- **Entity Management and Factory Pattern**: All entities were extracted and organized in a dedicated folder, allowing for a more organized structure. We implemented the Factory Pattern to manage entity creation. This abstraction ensures that the business logic remains independent and unaware of external dependencies.

- **Separation from External Agencies**: Business rules were designed to be entirely independent of external systems like databases or user interfaces. This enables testing business rules in isolation, increasing testability and reducing coupling to the outside world.

- **Dependency Injection for Authentication**: We abstracted away the authentication mechanism and used Dependency Injection to inject appropriate authentication handlers. This approach allows for swapping authentication methods without modifying core business logic, enhancing flexibility.

- **12-Factor App Principles**:
  - **Processes**: Focused on statelessness and concurrency, ensuring the app can handle multiple processes effectively.
  - **Port Binding**: Designed the app to expose services by binding to specific ports, aligning with cloud-based deployment best practices.
  - **Concurrency**: Improved the app's ability to scale by ensuring it can handle concurrent processes and is ready for agile scaling.

- **Input and Business Rule Validation**: Input validation was separated from business rule validation to ensure clean data before processing. Examples include enforcing positive amounts for transactions and verifying stock levels before allowing purchases.

- **Encapsulated Entity Operations**: Entities were designed to encapsulate all operations that affect their state, ensuring no invariants exist in the system. This design reinforces the principles of Domain-Driven Design by treating entities as self-contained, robust objects.

- **Repository Pattern for Data Abstraction**: Repositories were designed to always receive and return entities, providing a clear API for data storage. This abstraction allows switching databases or storage solutions without affecting the core logic.

- **Decoupled Bootstrapping**: A clear separation was made between the application entry point and HTTP framework initialization, using the Commander package to instantiate the Express server. This allows for flexibility in testing and future architectural changes.

By the end of Phase 3, the DMS project was structured to be highly modular, testable, and aligned with modern software architecture practices. This setup enhances agility, allowing us to quickly add new features or adjust existing ones without extensive refactoring.
