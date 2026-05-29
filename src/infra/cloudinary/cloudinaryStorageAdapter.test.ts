import { beforeEach, describe, expect, it, vi } from 'vitest'

const uploadMock = vi.fn()
const destroyMock = vi.fn()

vi.mock('./cloudinaryClient', () => ({
  cloudinary: {
    uploader: {
      upload: uploadMock,
      destroy: destroyMock,
    },
  },
}))

describe('CloudinaryStorageAdapter', () => {
  beforeEach(() => {
    uploadMock.mockReset()
    destroyMock.mockReset()
  })

  it('converts buffer uploads into a data uri and forwards the configured folder', async () => {
    uploadMock.mockResolvedValue({
      public_id: 'avatars/user-1',
      secure_url: 'https://res.cloudinary.com/demo/image/upload/v1/avatars/user-1.jpg',
      bytes: 1234,
      format: 'jpg',
      resource_type: 'image',
    })

    const { CloudinaryStorageAdapter } = await import('./cloudinaryStorageAdapter.js')
    const storage = new CloudinaryStorageAdapter({ folder: 'avatars' })

    const result = await storage.upload({
      buffer: Buffer.from('fake-image-bytes'),
      mimeType: 'image/jpeg',
    })

    expect(uploadMock).toHaveBeenCalledOnce()
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

    const { CloudinaryStorageAdapter } = await import('./cloudinaryStorageAdapter.js')
    const storage = new CloudinaryStorageAdapter({ resourceType: 'raw' })

    await storage.upload({ path: '/tmp/report.pdf' }, 'documents')
    await storage.delete('documents/report-1')

    expect(uploadMock).toHaveBeenCalledWith('/tmp/report.pdf', {
      folder: 'documents',
      resource_type: 'raw',
    })
    expect(destroyMock).toHaveBeenCalledWith('documents/report-1', {
      resource_type: 'raw',
    })
  })
})