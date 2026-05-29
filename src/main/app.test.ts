import { afterEach, describe, expect, it, vi } from 'vitest'
import type { AddressInfo } from 'node:net'
import { createApp } from './app'

describe('createApp', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the upload page, uploads an image, and allows selecting from the gallery', async () => {
    const uploadFileUseCase = {
      execute: vi.fn().mockResolvedValue({
        publicId: 'avatars/user-1',
        secureUrl: 'https://res.cloudinary.com/demo/image/upload/v1/avatars/user-1.jpg',
        bytes: 1234,
        format: 'jpg',
        resourceType: 'image',
      }),
    }
    const listGalleryImagesUseCase = {
      execute: vi.fn().mockResolvedValue([
        {
          publicId: 'uploads/avatar-1',
          secureUrl: 'https://res.cloudinary.com/demo/image/upload/v1/uploads/avatar-1.jpg',
          bytes: 300,
          format: 'jpg',
          resourceType: 'image',
        },
      ]),
    }
    const deleteGalleryImageUseCase = {
      execute: vi.fn().mockResolvedValue(undefined),
    }

    const app = createApp({ uploadFileUseCase, listGalleryImagesUseCase, deleteGalleryImageUseCase })
    const server = app.listen(0)
    const address = server.address() as AddressInfo

    try {
      const baseUrl = `http://127.0.0.1:${address.port}`

      const getResponse = await fetch(`${baseUrl}/upload`)
      const getHtml = await getResponse.text()

      expect(getResponse.status).toBe(200)
      expect(getHtml).toContain('Enviar imagem')
      expect(getHtml).toContain('Arquivo de imagem')

      const formData = new FormData()
      formData.append('image', new Blob([Buffer.from('fake-image-bytes')], { type: 'image/jpeg' }), 'avatar.jpg')
      formData.append('folder', 'avatars')

      const postResponse = await fetch(`${baseUrl}/upload`, {
        method: 'POST',
        body: formData,
      })
      const postHtml = await postResponse.text()

      expect(postResponse.status).toBe(200)
      expect(uploadFileUseCase.execute).toHaveBeenCalledWith({
        file: {
          buffer: expect.any(Buffer),
          mimeType: 'image/jpeg',
          originalName: 'avatar.jpg',
        },
        folder: 'avatars',
      })
      expect(postHtml).toContain('Envio concluído.')
      expect(postHtml).toContain('avatars/user-1')
      expect(postHtml).toContain('https://res.cloudinary.com/demo/image/upload/v1/avatars/user-1.jpg')

      const galleryResponse = await fetch(`${baseUrl}/gallery`)
      const galleryHtml = await galleryResponse.text()

      expect(galleryResponse.status).toBe(200)
      expect(galleryHtml).toContain('Galeria de imagens')
      expect(galleryHtml).toContain('Escolher imagem')

      const selectResponse = await fetch(`${baseUrl}/gallery/select`, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ publicId: 'uploads/avatar-1' }).toString(),
      })
      const selectHtml = await selectResponse.text()

      expect(selectResponse.status).toBe(200)
      expect(selectHtml).toContain('Imagem selecionada')
      expect(selectHtml).toContain('uploads/avatar-1')

      const deleteResponse = await fetch(`${baseUrl}/gallery/delete`, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ publicId: 'uploads/avatar-1' }).toString(),
      })
      const deleteHtml = await deleteResponse.text()

      expect(deleteResponse.status).toBe(200)
      expect(deleteGalleryImageUseCase.execute).toHaveBeenCalledWith({ publicId: 'uploads/avatar-1' })
      expect(deleteHtml).toContain('Imagem removida com sucesso.')
    } finally {
      server.close()
    }
  })
})