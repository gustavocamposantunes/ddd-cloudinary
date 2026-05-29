import { v2 as cloudinary } from 'cloudinary'
import { z } from 'zod'

const cloudinaryEnvSchema = z.object({
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
})

let isConfigured = false

function ensureCloudinaryConfigured(): void {
  if (isConfigured) {
    return
  }

  const cloudinaryEnv = cloudinaryEnvSchema.parse(process.env)

  cloudinary.config({
    cloud_name: cloudinaryEnv.CLOUDINARY_CLOUD_NAME,
    api_key: cloudinaryEnv.CLOUDINARY_API_KEY,
    api_secret: cloudinaryEnv.CLOUDINARY_API_SECRET,
  })

  isConfigured = true
}

export { cloudinary, ensureCloudinaryConfigured }