import { DocumentDTO } from "./document.dto";
import { UserDTO } from "./user.dto";

//pagination of all the documents in the database
export interface PaginatedDocumentsDTO {
  data: DocumentDTO[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

//Pagination of the Users in the database
export interface PaginatedUsersDTO {
  data: UserDTO[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}
