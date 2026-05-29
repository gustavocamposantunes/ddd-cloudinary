import { cloudinary, ensureCloudinaryConfigured } from './cloudinaryClient'
import type { FileUploadInput, FileUploadResult, IFileStorage } from '../../domain/contracts/IFileStorage'

type CloudinaryUploadResult = {
  public_id: string
  secure_url: string
  bytes: number
  format?: string
  resource_type: string
}

type CloudinaryResourcesResult = {
  resources: CloudinaryUploadResult[]
}

type CloudinaryStorageAdapterOptions = {
  folder?: string
  resourceType?: 'image' | 'video' | 'raw'
}

export class CloudinaryStorageAdapter implements IFileStorage {
  private readonly folder?: string
  private readonly resourceType: 'image' | 'video' | 'raw'

  constructor(options: CloudinaryStorageAdapterOptions = {}) {
    this.folder = options.folder
    this.resourceType = options.resourceType ?? 'image'
  }

  async upload(file: FileUploadInput, folder = this.folder): Promise<FileUploadResult> {
    ensureCloudinaryConfigured()

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
    ensureCloudinaryConfigured()

    await cloudinary.uploader.destroy(publicId, {
      resource_type: this.resourceType,
    })
  }

  async list(folder?: string): Promise<FileUploadResult[]> {
    ensureCloudinaryConfigured()

    const result = await cloudinary.api.resources({
      resource_type: this.resourceType,
      type: 'upload',
      ...(folder ? { prefix: folder } : {}),
      max_results: 100,
    })

    const resources = result as CloudinaryResourcesResult

    return resources.resources.map((resource) => ({
      publicId: resource.public_id,
      secureUrl: resource.secure_url,
      bytes: resource.bytes,
      format: resource.format,
      resourceType: resource.resource_type,
    }))
  }

  private toUploadPayload(file: FileUploadInput): string {
    if ('path' in file) {
      return file.path
    }

    const mimeType = file.mimeType ?? 'application/octet-stream'
    return `data:${mimeType};base64,${file.buffer.toString('base64')}`
  }
}