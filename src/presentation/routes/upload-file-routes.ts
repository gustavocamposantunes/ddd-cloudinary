import { Router } from 'express'
import multer from 'multer'
import type { UploadFileController } from '../controllers/upload-file-controller'

const upload = multer({ storage: multer.memoryStorage() })

export function createUploadFileRoutes(controller: UploadFileController): Router {
  const router = Router()

  router.get('/upload', controller.showForm.bind(controller))
  router.post('/upload', upload.single('image'), controller.handleUpload.bind(controller))

  return router
}