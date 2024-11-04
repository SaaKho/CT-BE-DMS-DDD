export interface DownloadLinkDTO {
  protocol: string;
  host: string;
  fileId: string; // Use fileId instead of filename
}

export interface DownloadLinkResponseDTO {
  link: string;
}

export interface FilePathDTO {
  path: string;
}
