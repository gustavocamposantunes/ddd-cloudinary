export type FileUploadInput =
  | {
      buffer: Buffer
      originalName?: string
      mimeType?: string
    }
  | {
      path: string
      originalName?: string
    }

export interface FileUploadResult {
  publicId: string
  secureUrl: string
  bytes: number
  format?: string
  resourceType: string
}

export interface IFileStorage {
  upload(file: FileUploadInput, folder?: string): Promise<FileUploadResult>
  delete(publicId: string): Promise<void>
}