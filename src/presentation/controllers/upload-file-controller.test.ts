import { describe, expect, it, vi } from 'vitest'
import { UploadFileController } from './upload-file-controller.js'

function createResponseMock() {
  return {
    status: vi.fn().mockReturnThis(),
    render: vi.fn(),
  }
}

describe('UploadFileController', () => {
  it('renders the form on GET', async () => {
    const uploadFileUseCase = {
      execute: vi.fn(),
    }
    const controller = new UploadFileController({ uploadFileUseCase })
    const response = createResponseMock()

    await controller.showForm({} as never, response as never)

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.render).toHaveBeenCalledWith('pages/upload-page', {
      title: 'Cloudinary upload',
      formValues: {},
    })
  })

  it('renders an error when the path is missing', async () => {
    const uploadFileUseCase = {
      execute: vi.fn(),
    }
    const controller = new UploadFileController({ uploadFileUseCase })
    const response = createResponseMock()

    await controller.handleUpload({ body: { folder: 'avatars' } } as never, response as never)

    expect(uploadFileUseCase.execute).not.toHaveBeenCalled()
    expect(response.render).toHaveBeenCalledWith('pages/upload-page', {
      title: 'Cloudinary upload',
      errorMessage: 'Provide a file path to upload.',
      formValues: {
        folder: 'avatars',
        mimeType: undefined,
        originalName: undefined,
      },
    })
  })

  it('delegates to the use case and renders the result', async () => {
    const uploadResult = {
      publicId: 'avatars/user-1',
      secureUrl: 'https://res.cloudinary.com/demo/image/upload/v1/avatars/user-1.jpg',
      bytes: 1234,
      format: 'jpg',
      resourceType: 'image',
    }
    const uploadFileUseCase = {
      execute: vi.fn().mockResolvedValue(uploadResult),
    }
    const controller = new UploadFileController({ uploadFileUseCase })
    const response = createResponseMock()

    await controller.handleUpload(
      {
        body: {
          path: '/tmp/avatar.jpg',
          folder: 'avatars',
          mimeType: 'image/jpeg',
          originalName: 'avatar.jpg',
        },
      } as never,
      response as never,
    )

    expect(uploadFileUseCase.execute).toHaveBeenCalledWith({
      file: {
        path: '/tmp/avatar.jpg',
        originalName: 'avatar.jpg',
      },
      folder: 'avatars',
    })
    expect(response.render).toHaveBeenCalledWith('pages/upload-page', {
      title: 'Cloudinary upload',
      uploadResult,
      formValues: {
        path: '/tmp/avatar.jpg',
        folder: 'avatars',
        mimeType: 'image/jpeg',
        originalName: 'avatar.jpg',
      },
    })
  })
})