import { beforeEach, describe, expect, it } from 'vitest'
import type { FileUploadResult, IFileStorage } from '../../../domain/contracts/IFileStorage'
import { ListGalleryImagesUseCase } from './list-gallery-images-usecase'

class FileStorageGallerySpy implements IFileStorage {
  public listCalls: Array<string | undefined> = []

  constructor(private readonly result: FileUploadResult[]) {}

  async upload(): Promise<FileUploadResult> {
    throw new Error('upload should not be called')
  }

  async delete(): Promise<void> {
    throw new Error('delete should not be called')
  }

  async list(folder?: string): Promise<FileUploadResult[]> {
    this.listCalls.push(folder)
    return this.result
  }
}

describe('ListGalleryImagesUseCase', () => {
  const images: FileUploadResult[] = [
    {
      publicId: 'uploads/avatar-1',
      secureUrl: 'https://res.cloudinary.com/demo/image/upload/v1/uploads/avatar-1.jpg',
      bytes: 300,
      format: 'jpg',
      resourceType: 'image',
    },
  ]

  let storageSpy: FileStorageGallerySpy

  beforeEach(() => {
    storageSpy = new FileStorageGallerySpy(images)
  })

  it('lists images from the provided folder', async () => {
    const useCase = new ListGalleryImagesUseCase(storageSpy)

    const result = await useCase.execute({ folder: 'uploads' })

    expect(result).toEqual(images)
    expect(storageSpy.listCalls).toEqual(['uploads'])
  })

  it('lists images without a folder when none is provided', async () => {
    const useCase = new ListGalleryImagesUseCase(storageSpy)

    await useCase.execute()

    expect(storageSpy.listCalls).toEqual([undefined])
  })
})