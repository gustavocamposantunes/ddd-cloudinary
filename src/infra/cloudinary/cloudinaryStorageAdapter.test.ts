import { beforeEach, describe, expect, it, vi } from 'vitest'

const uploadMock = vi.fn()
const destroyMock = vi.fn()
const resourcesMock = vi.fn()
const ensureCloudinaryConfiguredMock = vi.fn()

vi.mock('./cloudinaryClient', () => ({
  cloudinary: {
    uploader: {
      upload: uploadMock,
      destroy: destroyMock,
    },
    api: {
      resources: resourcesMock,
    },
  },
  ensureCloudinaryConfigured: ensureCloudinaryConfiguredMock,
}))

describe('CloudinaryStorageAdapter', () => {
  beforeEach(() => {
    uploadMock.mockReset()
    destroyMock.mockReset()
    resourcesMock.mockReset()
    ensureCloudinaryConfiguredMock.mockReset()
  })

  it('converts buffer uploads into a data uri and forwards the configured folder', async () => {
    uploadMock.mockResolvedValue({
      public_id: 'avatars/user-1',
      secure_url: 'https://res.cloudinary.com/demo/image/upload/v1/avatars/user-1.jpg',
      bytes: 1234,
      format: 'jpg',
      resource_type: 'image',
    })

    const { CloudinaryStorageAdapter } = await import('./cloudinaryStorageAdapter')
    const storage = new CloudinaryStorageAdapter({ folder: 'avatars' })

    const result = await storage.upload({
      buffer: Buffer.from('fake-image-bytes'),
      mimeType: 'image/jpeg',
    })

    expect(uploadMock).toHaveBeenCalledOnce()
    expect(ensureCloudinaryConfiguredMock).toHaveBeenCalledOnce()
    expect(uploadMock).toHaveBeenCalledWith('data:image/jpeg;base64,ZmFrZS1pbWFnZS1ieXRlcw==', {
      folder: 'avatars',
      resource_type: 'image',
    })
    expect(result).toEqual({
      publicId: 'avatars/user-1',
      secureUrl: 'https://res.cloudinary.com/demo/image/upload/v1/avatars/user-1.jpg',
      bytes: 1234,
      format: 'jpg',
      resourceType: 'image',
    })
  })

  it('forwards file path uploads without conversion and deletes using the resource type', async () => {
    uploadMock.mockResolvedValue({
      public_id: 'documents/report-1',
      secure_url: 'https://res.cloudinary.com/demo/raw/upload/v1/documents/report-1.pdf',
      bytes: 2048,
      format: 'pdf',
      resource_type: 'raw',
    })
    destroyMock.mockResolvedValue({ result: 'ok' })

    const { CloudinaryStorageAdapter } = await import('./cloudinaryStorageAdapter')
    const storage = new CloudinaryStorageAdapter({ resourceType: 'raw' })

    await storage.upload({ path: '/tmp/report.pdf' }, 'documents')
    await storage.delete('documents/report-1')

    expect(uploadMock).toHaveBeenCalledWith('/tmp/report.pdf', {
      folder: 'documents',
      resource_type: 'raw',
    })
    expect(ensureCloudinaryConfiguredMock).toHaveBeenCalledTimes(2)
    expect(destroyMock).toHaveBeenCalledWith('documents/report-1', {
      resource_type: 'raw',
    })
  })

  it('lists image resources from the configured folder', async () => {
    resourcesMock.mockResolvedValue({
      resources: [
        {
          public_id: 'uploads/avatar-1',
          secure_url: 'https://res.cloudinary.com/demo/image/upload/v1/uploads/avatar-1.jpg',
          bytes: 300,
          format: 'jpg',
          resource_type: 'image',
        },
      ],
    })

    const { CloudinaryStorageAdapter } = await import('./cloudinaryStorageAdapter')
    const storage = new CloudinaryStorageAdapter({ folder: 'uploads' })

    const result = await storage.list('uploads')

    expect(resourcesMock).toHaveBeenCalledWith({
      resource_type: 'image',
      type: 'upload',
      prefix: 'uploads',
      max_results: 100,
    })
    expect(ensureCloudinaryConfiguredMock).toHaveBeenCalledOnce()
    expect(result).toEqual([
      {
        publicId: 'uploads/avatar-1',
        secureUrl: 'https://res.cloudinary.com/demo/image/upload/v1/uploads/avatar-1.jpg',
        bytes: 300,
        format: 'jpg',
        resourceType: 'image',
      },
    ])
  })
})