import type { FileUploadResult, IFileStorage } from '../../../domain/contracts/IFileStorage'

export type ListGalleryImagesUseCaseInput = {
  folder?: string
}

export class ListGalleryImagesUseCase {
  constructor(private readonly fileStorage: IFileStorage) {}

  async execute(input: ListGalleryImagesUseCaseInput = {}): Promise<FileUploadResult[]> {
    return this.fileStorage.list(input.folder)
  }
}