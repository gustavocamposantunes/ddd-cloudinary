import { createApp } from './app.js'
import { UploadFileUseCase } from '../data/usecases/upload-file/upload-file-usecase.js'
import { CloudinaryStorageAdapter } from '../infra/cloudinary/cloudinaryStorageAdapter.js'

const uploadFileUseCase = new UploadFileUseCase(new CloudinaryStorageAdapter({ folder: 'uploads' }))
const app = createApp({ uploadFileUseCase })

const port = Number(process.env.PORT || 3000)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})