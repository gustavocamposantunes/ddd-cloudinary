import { cloudinary } from './cloudinaryClient.js'
import type { FileUploadInput, FileUploadResult, IFileStorage } from '../../domain/contracts/IFileStorage.js'

type CloudinaryUploadResult = {
  public_id: string
  secure_url: string
  bytes: number
  format?: string
  resource_type: string
}

type CloudinaryStorageOptions = {
  folder?: string
  resourceType?: 'image' | 'video' | 'raw'
}

export class CloudinaryStorage implements IFileStorage {
  private readonly folder?: string
  private readonly resourceType: 'image' | 'video' | 'raw'

  constructor(options: CloudinaryStorageOptions = {}) {
    this.folder = options.folder
    this.resourceType = options.resourceType ?? 'image'
  }

  async upload(file: FileUploadInput, folder = this.folder): Promise<FileUploadResult> {
    const result = await cloudinary.uploader.upload(this.toUploadPayload(file), {
      folder,
      resource_type: this.resourceType,
    })

    const uploaded = result as CloudinaryUploadResult

    return {
      publicId: uploaded.public_id,
      secureUrl: uploaded.secure_url,
      bytes: uploaded.bytes,
      format: uploaded.format,
      resourceType: uploaded.resource_type,
    }
  }

  async delete(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: this.resourceType,
    })
  }

  private toUploadPayload(file: FileUploadInput): string {
    if ('path' in file) {
      return file.path
    }

    const mimeType = file.mimeType ?? 'application/octet-stream'
    return `data:${mimeType};base64,${file.buffer.toString('base64')}`
  }
}