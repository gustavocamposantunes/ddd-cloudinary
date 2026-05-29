import type { FileUploadInput, FileUploadResult, IFileStorage } from '../../../domain/contracts/IFileStorage.js'

export type UploadFileUseCaseInput = {
  file: FileUploadInput
  folder?: string
}

export class UploadFileUseCase {
  constructor(private readonly fileStorage: IFileStorage) {}

  async execute(input: UploadFileUseCaseInput): Promise<FileUploadResult> {
    return this.fileStorage.upload(input.file, input.folder)
  }
}