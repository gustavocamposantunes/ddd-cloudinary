import { afterEach, describe, expect, it, vi } from 'vitest'
import type { AddressInfo } from 'node:net'
import { createApp } from './app'

describe('createApp', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the upload page and processes a valid upload submission', async () => {
    const uploadFileUseCase = {
      execute: vi.fn().mockResolvedValue({
        publicId: 'avatars/user-1',
        secureUrl: 'https://res.cloudinary.com/demo/image/upload/v1/avatars/user-1.jpg',
        bytes: 1234,
        format: 'jpg',
        resourceType: 'image',
      }),
    }

    const app = createApp({ uploadFileUseCase })
    const server = app.listen(0)
    const address = server.address() as AddressInfo

    try {
      const baseUrl = `http://127.0.0.1:${address.port}`

      const getResponse = await fetch(`${baseUrl}/upload`)
      const getHtml = await getResponse.text()

      expect(getResponse.status).toBe(200)
      expect(getHtml).toContain('Cloudinary upload')
      expect(getHtml).toContain('Submit a file path')

      const postResponse = await fetch(`${baseUrl}/upload`, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          path: '/tmp/avatar.jpg',
          folder: 'avatars',
          mimeType: 'image/jpeg',
          originalName: 'avatar.jpg',
        }).toString(),
      })
      const postHtml = await postResponse.text()

      expect(postResponse.status).toBe(200)
      expect(uploadFileUseCase.execute).toHaveBeenCalledWith({
        file: {
          path: '/tmp/avatar.jpg',
          originalName: 'avatar.jpg',
        },
        folder: 'avatars',
      })
      expect(postHtml).toContain('Upload completed.')
      expect(postHtml).toContain('avatars/user-1')
      expect(postHtml).toContain('https://res.cloudinary.com/demo/image/upload/v1/avatars/user-1.jpg')
    } finally {
      server.close()
    }
  })
})