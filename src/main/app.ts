import express from 'express'
import path from 'node:path'
import type { UploadFileUseCase } from '../data/usecases/upload-file/upload-file-usecase'
import type { ListGalleryImagesUseCase } from '../data/usecases/list-gallery-images/list-gallery-images-usecase'
import type { DeleteGalleryImageUseCase } from '../data/usecases/delete-gallery-image/delete-gallery-image-usecase'
import { GalleryController } from '../presentation/controllers/gallery-controller'
import { UploadFileController } from '../presentation/controllers/upload-file-controller'
import { createGalleryRoutes } from '../presentation/routes/gallery-routes'
import { createUploadFileRoutes } from '../presentation/routes/upload-file-routes'

export type AppDependencies = {
  uploadFileUseCase: Pick<UploadFileUseCase, 'execute'>
  listGalleryImagesUseCase: Pick<ListGalleryImagesUseCase, 'execute'>
  deleteGalleryImageUseCase: Pick<DeleteGalleryImageUseCase, 'execute'>
}

export function createApp(dependencies: AppDependencies) {
  const app = express()
  const controller = new UploadFileController({ uploadFileUseCase: dependencies.uploadFileUseCase })
  const galleryController = new GalleryController({
    listGalleryImagesUseCase: dependencies.listGalleryImagesUseCase,
    deleteGalleryImageUseCase: dependencies.deleteGalleryImageUseCase,
  })

  app.set('view engine', 'ejs')
  app.set('views', path.resolve('src/presentation/views'))
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())

  app.use(createUploadFileRoutes(controller))
  app.use(createGalleryRoutes(galleryController))

  return app
}