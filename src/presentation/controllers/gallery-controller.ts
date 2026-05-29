import type { Request, Response } from 'express'
import type { FileUploadResult } from '../../domain/contracts/IFileStorage'
import type { ListGalleryImagesUseCase } from '../../data/usecases/list-gallery-images/list-gallery-images-usecase'
import type { DeleteGalleryImageUseCase } from '../../data/usecases/delete-gallery-image/delete-gallery-image-usecase'

export interface GalleryControllerDependencies {
  listGalleryImagesUseCase: Pick<ListGalleryImagesUseCase, 'execute'>
  deleteGalleryImageUseCase: Pick<DeleteGalleryImageUseCase, 'execute'>
}

type GalleryViewModel = {
  title: string
  images: FileUploadResult[]
  selectedImage?: FileUploadResult
  errorMessage?: string
  successMessage?: string
}

export class GalleryController {
  constructor(private readonly dependencies: GalleryControllerDependencies) {}

  async showGallery(_request: Request, response: Response): Promise<void> {
    try {
      const images = await this.dependencies.listGalleryImagesUseCase.execute({ folder: 'uploads' })

      await this.renderGallery(response, {
        title: 'Galeria de imagens',
        images,
      })
    } catch {
      await this.renderGallery(response, {
        title: 'Galeria de imagens',
        images: [],
        errorMessage: 'Configure as credenciais do Cloudinary para carregar a galeria.',
      })
    }
  }

  async chooseImage(request: Request, response: Response): Promise<void> {
    const body = request.body as Record<string, string | undefined>
    const selectedPublicId = body.publicId?.trim()
    try {
      const images = await this.dependencies.listGalleryImagesUseCase.execute({ folder: 'uploads' })
      const selectedImage = selectedPublicId
        ? images.find((image) => image.publicId === selectedPublicId)
        : undefined

      await this.renderGallery(response, {
        title: 'Galeria de imagens',
        images,
        selectedImage,
        errorMessage: selectedPublicId && !selectedImage ? 'Escolha uma imagem da galeria.' : undefined,
      })
    } catch {
      await this.renderGallery(response, {
        title: 'Galeria de imagens',
        images: [],
        errorMessage: 'Configure as credenciais do Cloudinary para carregar a galeria.',
      })
    }
  }

  async deleteImage(request: Request, response: Response): Promise<void> {
    const body = request.body as Record<string, string | undefined>
    const publicId = body.publicId?.trim()

    if (!publicId) {
      const images = await this.dependencies.listGalleryImagesUseCase.execute({ folder: 'uploads' })

      await this.renderGallery(response, {
        title: 'Galeria de imagens',
        images,
        errorMessage: 'Escolha uma imagem válida para remover.',
      })
      return
    }

    try {
      await this.dependencies.deleteGalleryImageUseCase.execute({ publicId })
      const images = await this.dependencies.listGalleryImagesUseCase.execute({ folder: 'uploads' })

      await this.renderGallery(response, {
        title: 'Galeria de imagens',
        images,
        successMessage: 'Imagem removida com sucesso.',
      })
    } catch {
      await this.renderGallery(response, {
        title: 'Galeria de imagens',
        images: [],
        errorMessage: 'Configure as credenciais do Cloudinary para carregar a galeria.',
      })
    }
  }

  private async renderGallery(response: Response, viewModel: GalleryViewModel): Promise<void> {
    response.status(200)
    response.render('pages/gallery-page', {
      title: viewModel.title,
      images: viewModel.images,
      selectedImage: viewModel.selectedImage,
      errorMessage: viewModel.errorMessage,
      successMessage: viewModel.successMessage,
    })
  }
}