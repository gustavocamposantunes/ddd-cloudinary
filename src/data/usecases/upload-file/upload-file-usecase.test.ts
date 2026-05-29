import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { FileUploadInput, FileUploadResult, IFileStorage } from '../../../domain/contracts/IFileStorage'
import { UploadFileUseCase } from './upload-file-usecase'

class FileStorageSpy implements IFileStorage {
  public uploadCalls: Array<{ file: FileUploadInput; folder?: string }> = []
  public deleteCalls: Array<string> = []

  constructor(private readonly result: FileUploadResult) {}

  async upload(file: FileUploadInput, folder?: string): Promise<FileUploadResult> {
    this.uploadCalls.push({ file, folder })
    return this.result
  }

  async delete(publicId: string): Promise<void> {
    this.deleteCalls.push(publicId)
  }

  async list(): Promise<FileUploadResult[]> {
    return []
  }
}

describe('UploadFileUseCase', () => {
  const uploadResult: FileUploadResult = {
    publicId: 'avatars/user-1',
    secureUrl: 'https://res.cloudinary.com/demo/image/upload/v1/avatars/user-1.jpg',
    bytes: 1234,
    format: 'jpg',
    resourceType: 'image',
  }

  let storageSpy: FileStorageSpy

  beforeEach(() => {
    storageSpy = new FileStorageSpy(uploadResult)
  })

  it('delegates the upload to the file storage with the provided folder', async () => {
    const useCase = new UploadFileUseCase(storageSpy)

    const result = await useCase.execute({
      file: {
        buffer: Buffer.from('fake-image-bytes'),
        mimeType: 'image/jpeg',
      },
      folder: 'avatars',
    })

    expect(result).toEqual(uploadResult)
    expect(storageSpy.uploadCalls).toEqual([
      {
        file: {
          buffer: Buffer.from('fake-image-bytes'),
          mimeType: 'image/jpeg',
        },
        folder: 'avatars',
      },
    ])
  })

  it('delegates the upload without a folder when none is provided', async () => {
    const useCase = new UploadFileUseCase(storageSpy)

    await useCase.execute({
      file: {
        path: '/tmp/report.pdf',
      },
    })

    expect(storageSpy.uploadCalls).toEqual([
      {
        file: {
          path: '/tmp/report.pdf',
        },
        folder: undefined,
      },
    ])
  })
})