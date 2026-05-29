import 'dotenv/config'

import { createApp } from './app'
import { UploadFileUseCase } from '../data/usecases/upload-file/upload-file-usecase'
import { ListGalleryImagesUseCase } from '../data/usecases/list-gallery-images/list-gallery-images-usecase'
import { DeleteGalleryImageUseCase } from '../data/usecases/delete-gallery-image/delete-gallery-image-usecase'
import { CloudinaryStorageAdapter } from '../infra/cloudinary/cloudinaryStorageAdapter'

const storage = new CloudinaryStorageAdapter({ folder: 'uploads' })
const uploadFileUseCase = new UploadFileUseCase(storage)
const listGalleryImagesUseCase = new ListGalleryImagesUseCase(storage)
const deleteGalleryImageUseCase = new DeleteGalleryImageUseCase(storage)
const app = createApp({ uploadFileUseCase, listGalleryImagesUseCase, deleteGalleryImageUseCase })

const port = Number(process.env.PORT || 3000)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})