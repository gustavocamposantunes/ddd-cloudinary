import { describe, expect, it, vi } from 'vitest'
import { UploadFileController } from './upload-file-controller'

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
      title: 'Enviar imagem',
      formValues: {},
    })
  })

  it('renders an error when the image file is missing', async () => {
    const uploadFileUseCase = {
      execute: vi.fn(),
    }
    const controller = new UploadFileController({ uploadFileUseCase })
    const response = createResponseMock()

    await controller.handleUpload({ body: { folder: 'avatars' } } as never, response as never)

    expect(uploadFileUseCase.execute).not.toHaveBeenCalled()
    expect(response.render).toHaveBeenCalledWith('pages/upload-page', {
      title: 'Enviar imagem',
      errorMessage: 'Envie um arquivo de imagem para continuar.',
      formValues: {
        folder: 'avatars',
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
        file: {
          buffer: Buffer.from('fake-image-bytes'),
          mimetype: 'image/jpeg',
          originalname: 'avatar.jpg',
        },
        body: {
          folder: 'avatars',
        },
      } as never,
      response as never,
    )

    expect(uploadFileUseCase.execute).toHaveBeenCalledWith({
      file: {
        buffer: Buffer.from('fake-image-bytes'),
        mimeType: 'image/jpeg',
        originalName: 'avatar.jpg',
      },
      folder: 'avatars',
    })
    expect(response.render).toHaveBeenCalledWith('pages/upload-page', {
      title: 'Enviar imagem',
      uploadResult,
      formValues: {
        folder: 'avatars',
      },
    })
  })
})