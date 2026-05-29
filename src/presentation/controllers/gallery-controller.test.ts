import { describe, expect, it, vi } from 'vitest'
import { GalleryController } from './gallery-controller'

function createResponseMock() {
  return {
    status: vi.fn().mockReturnThis(),
    render: vi.fn(),
  }
}

describe('GalleryController', () => {
  it('renders the image gallery', async () => {
    const listGalleryImagesUseCase = {
      execute: vi.fn().mockResolvedValue([
        {
          publicId: 'uploads/avatar-1',
          secureUrl: 'https://res.cloudinary.com/demo/image/upload/v1/uploads/avatar-1.jpg',
          bytes: 300,
          format: 'jpg',
          resourceType: 'image',
        },
      ]),
    }
    const deleteGalleryImageUseCase = {
      execute: vi.fn(),
    }
    const controller = new GalleryController({ listGalleryImagesUseCase, deleteGalleryImageUseCase })
    const response = createResponseMock()

    await controller.showGallery({} as never, response as never)

    expect(listGalleryImagesUseCase.execute).toHaveBeenCalledWith({ folder: 'uploads' })
    expect(response.render).toHaveBeenCalledWith('pages/gallery-page', {
      title: 'Galeria de imagens',
      images: [
        {
          publicId: 'uploads/avatar-1',
          secureUrl: 'https://res.cloudinary.com/demo/image/upload/v1/uploads/avatar-1.jpg',
          bytes: 300,
          format: 'jpg',
          resourceType: 'image',
        },
      ],
      selectedImage: undefined,
      errorMessage: undefined,
      successMessage: undefined,
    })
  })

  it('selects an image from the gallery', async () => {
    const listGalleryImagesUseCase = {
      execute: vi.fn().mockResolvedValue([
        {
          publicId: 'uploads/avatar-1',
          secureUrl: 'https://res.cloudinary.com/demo/image/upload/v1/uploads/avatar-1.jpg',
          bytes: 300,
          format: 'jpg',
          resourceType: 'image',
        },
      ]),
    }
    const deleteGalleryImageUseCase = {
      execute: vi.fn(),
    }
    const controller = new GalleryController({ listGalleryImagesUseCase, deleteGalleryImageUseCase })
    const response = createResponseMock()

    await controller.chooseImage({ body: { publicId: 'uploads/avatar-1' } } as never, response as never)

    expect(response.render).toHaveBeenCalledWith('pages/gallery-page', {
      title: 'Galeria de imagens',
      images: [
        {
          publicId: 'uploads/avatar-1',
          secureUrl: 'https://res.cloudinary.com/demo/image/upload/v1/uploads/avatar-1.jpg',
          bytes: 300,
          format: 'jpg',
          resourceType: 'image',
        },
      ],
      selectedImage: {
        publicId: 'uploads/avatar-1',
        secureUrl: 'https://res.cloudinary.com/demo/image/upload/v1/uploads/avatar-1.jpg',
        bytes: 300,
        format: 'jpg',
        resourceType: 'image',
      },
      errorMessage: undefined,
      successMessage: undefined,
    })
  })

  it('deletes an image from the gallery and reloads the list', async () => {
    const listGalleryImagesUseCase = {
      execute: vi.fn().mockResolvedValue([
        {
          publicId: 'uploads/avatar-2',
          secureUrl: 'https://res.cloudinary.com/demo/image/upload/v1/uploads/avatar-2.jpg',
          bytes: 280,
          format: 'jpg',
          resourceType: 'image',
        },
      ]),
    }
    const deleteGalleryImageUseCase = {
      execute: vi.fn().mockResolvedValue(undefined),
    }
    const controller = new GalleryController({ listGalleryImagesUseCase, deleteGalleryImageUseCase })
    const response = createResponseMock()

    await controller.deleteImage({ body: { publicId: 'uploads/avatar-1' } } as never, response as never)

    expect(deleteGalleryImageUseCase.execute).toHaveBeenCalledWith({ publicId: 'uploads/avatar-1' })
    expect(listGalleryImagesUseCase.execute).toHaveBeenCalledWith({ folder: 'uploads' })
    expect(response.render).toHaveBeenCalledWith('pages/gallery-page', {
      title: 'Galeria de imagens',
      images: [
        {
          publicId: 'uploads/avatar-2',
          secureUrl: 'https://res.cloudinary.com/demo/image/upload/v1/uploads/avatar-2.jpg',
          bytes: 280,
          format: 'jpg',
          resourceType: 'image',
        },
      ],
      selectedImage: undefined,
      errorMessage: undefined,
      successMessage: 'Imagem removida com sucesso.',
    })
  })

  it('renders an error when trying to delete without an image id', async () => {
    const listGalleryImagesUseCase = {
      execute: vi.fn().mockResolvedValue([
        {
          publicId: 'uploads/avatar-1',
          secureUrl: 'https://res.cloudinary.com/demo/image/upload/v1/uploads/avatar-1.jpg',
          bytes: 300,
          format: 'jpg',
          resourceType: 'image',
        },
      ]),
    }
    const deleteGalleryImageUseCase = {
      execute: vi.fn(),
    }
    const controller = new GalleryController({ listGalleryImagesUseCase, deleteGalleryImageUseCase })
    const response = createResponseMock()

    await controller.deleteImage({ body: {} } as never, response as never)

    expect(deleteGalleryImageUseCase.execute).not.toHaveBeenCalled()
    expect(response.render).toHaveBeenCalledWith('pages/gallery-page', {
      title: 'Galeria de imagens',
      images: [
        {
          publicId: 'uploads/avatar-1',
          secureUrl: 'https://res.cloudinary.com/demo/image/upload/v1/uploads/avatar-1.jpg',
          bytes: 300,
          format: 'jpg',
          resourceType: 'image',
        },
      ],
      selectedImage: undefined,
      errorMessage: 'Escolha uma imagem válida para remover.',
      successMessage: undefined,
    })
  })

  it('renders a friendly message when the gallery cannot be loaded', async () => {
    const listGalleryImagesUseCase = {
      execute: vi.fn().mockRejectedValue(new Error('Missing Cloudinary credentials')),
    }
    const deleteGalleryImageUseCase = {
      execute: vi.fn(),
    }
    const controller = new GalleryController({ listGalleryImagesUseCase, deleteGalleryImageUseCase })
    const response = createResponseMock()

    await controller.showGallery({} as never, response as never)

    expect(response.render).toHaveBeenCalledWith('pages/gallery-page', {
      title: 'Galeria de imagens',
      images: [],
      selectedImage: undefined,
      errorMessage: 'Configure as credenciais do Cloudinary para carregar a galeria.',
      successMessage: undefined,
    })
  })
})