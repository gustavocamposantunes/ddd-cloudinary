import express from 'express'
import path from 'node:path'
import type { UploadFileUseCase } from '../data/usecases/upload-file/upload-file-usecase'
import { UploadFileController } from '../presentation/controllers/upload-file-controller'
import { createUploadFileRoutes } from '../presentation/routes/upload-file-routes'

export type AppDependencies = {
  uploadFileUseCase: Pick<UploadFileUseCase, 'execute'>
}

export function createApp(dependencies: AppDependencies) {
  const app = express()
  const controller = new UploadFileController({ uploadFileUseCase: dependencies.uploadFileUseCase })

  app.set('view engine', 'ejs')
  app.set('views', path.resolve('src/presentation/views'))
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())

  app.use(createUploadFileRoutes(controller))

  return app
}