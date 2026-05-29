import { Router } from 'express'
import type { UploadFileController } from '../controllers/upload-file-controller'

export function createUploadFileRoutes(controller: UploadFileController): Router {
  const router = Router()

  router.get('/upload', controller.showForm.bind(controller))
  router.post('/upload', controller.handleUpload.bind(controller))

  return router
}