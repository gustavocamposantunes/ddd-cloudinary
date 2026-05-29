import { describe, expect, it, vi } from 'vitest'
import type { FileUploadInput, FileUploadResult, IFileStorage } from '../../../domain/contracts/IFileStorage'
import { DeleteGalleryImageUseCase } from './delete-gallery-image-usecase'

class FileStorageSpy implements IFileStorage {
  public uploadCalls: Array<{ file: FileUploadInput; folder?: string }> = []
  public deleteCalls: Array<string> = []

  async upload(file: FileUploadInput, folder?: string): Promise<FileUploadResult> {
    this.uploadCalls.push({ file, folder })
    return {
      publicId: 'unused',
      secureUrl: 'https://example.com/unused',
      bytes: 0,
      resourceType: 'image',
    }
  }

  async delete(publicId: string): Promise<void> {
    this.deleteCalls.push(publicId)
  }

  async list(): Promise<FileUploadResult[]> {
    return []
  }
}

describe('DeleteGalleryImageUseCase', () => {
  it('delegates deletion to file storage with the provided public id', async () => {
    const storageSpy = new FileStorageSpy()
    const useCase = new DeleteGalleryImageUseCase(storageSpy)

    await useCase.execute({ publicId: 'uploads/avatar-1' })

    expect(storageSpy.deleteCalls).toEqual(['uploads/avatar-1'])
  })
})