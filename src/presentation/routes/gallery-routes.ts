import { Router } from 'express'
import type { GalleryController } from '../controllers/gallery-controller'

export function createGalleryRoutes(controller: GalleryController): Router {
  const router = Router()

  router.get('/gallery', controller.showGallery.bind(controller))
  router.post('/gallery/select', controller.chooseImage.bind(controller))
  router.post('/gallery/delete', controller.deleteImage.bind(controller))

  return router
}