import type { Request, Response } from 'express'
import type { FileUploadResult } from '../../domain/contracts/IFileStorage'
import type { ListGalleryImagesUseCase } from '../../data/usecases/list-gallery-images/list-gallery-images-usecase'

export interface GalleryControllerDependencies {
  listGalleryImagesUseCase: Pick<ListGalleryImagesUseCase, 'execute'>
}

type GalleryViewModel = {
  title: string
  images: FileUploadResult[]
  selectedImage?: FileUploadResult
  errorMessage?: string
}

export class GalleryController {
  constructor(private readonly dependencies: GalleryControllerDependencies) {}

  async showGallery(_request: Request, response: Response): Promise<void> {
    try {
      const images = await this.dependencies.listGalleryImagesUseCase.execute({ folder: 'uploads' })

      await this.renderGallery(response, {
        title: 'Image gallery',
        images,
      })
    } catch {
      await this.renderGallery(response, {
        title: 'Image gallery',
        images: [],
        errorMessage: 'Configure Cloudinary credentials to load the gallery.',
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
        title: 'Image gallery',
        images,
        selectedImage,
        errorMessage: selectedPublicId && !selectedImage ? 'Choose an image from the gallery.' : undefined,
      })
    } catch {
      await this.renderGallery(response, {
        title: 'Image gallery',
        images: [],
        errorMessage: 'Configure Cloudinary credentials to load the gallery.',
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
    })
  }
}