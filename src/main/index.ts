import { createApp } from './app'
import { UploadFileUseCase } from '../data/usecases/upload-file/upload-file-usecase'
import { CloudinaryStorageAdapter } from '../infra/cloudinary/cloudinaryStorageAdapter'

const uploadFileUseCase = new UploadFileUseCase(new CloudinaryStorageAdapter({ folder: 'uploads' }))
const app = createApp({ uploadFileUseCase })

const port = Number(process.env.PORT || 3000)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})