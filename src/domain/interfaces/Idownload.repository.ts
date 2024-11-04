// src/repository/interfaces/IDownloadRepository.ts

export interface IDownloadRepository {
  generateDownloadLink(
    protocol: string,
    host: string,
    filename: string
  ): string;
  serveFileByToken(token: string): string;
}
