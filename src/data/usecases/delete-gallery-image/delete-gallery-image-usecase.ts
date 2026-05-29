import type { IFileStorage } from '../../../domain/contracts/IFileStorage'

export type DeleteGalleryImageUseCaseInput = {
  publicId: string
}

export class DeleteGalleryImageUseCase {
  constructor(private readonly fileStorage: IFileStorage) {}

  async execute(input: DeleteGalleryImageUseCaseInput): Promise<void> {
    await this.fileStorage.delete(input.publicId)
  }
}