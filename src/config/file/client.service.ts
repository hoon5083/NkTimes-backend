export interface FileClientService {
  uploadFile(
    key: string,
    file: Buffer,
    size: number,
    uploadTime: Date,
    originalName: string,
    mimeType: string
  );
  getFile(key: string);
  removeFile(key: string);
}
