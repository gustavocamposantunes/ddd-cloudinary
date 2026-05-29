import type { Request, Response } from 'express'
import type { FileUploadResult } from '../../domain/contracts/IFileStorage'
import type { UploadFileUseCase, UploadFileUseCaseInput } from '../../data/usecases/upload-file/upload-file-usecase'

export interface UploadFileControllerDependencies {
  uploadFileUseCase: Pick<UploadFileUseCase, 'execute'>
}

type UploadPageViewModel = {
  title: string
  errorMessage?: string
  uploadResult?: FileUploadResult
  formValues?: {
    path?: string
    folder?: string
    mimeType?: string
    originalName?: string
  }
}

export class UploadFileController {
  constructor(private readonly dependencies: UploadFileControllerDependencies) {}

  async showForm(_request: Request, response: Response): Promise<void> {
    await this.renderPage(response, {
      title: 'Upload image',
      formValues: {},
    })
  }

  async handleUpload(request: Request, response: Response): Promise<void> {
    const uploadedFile = request.file as Express.Multer.File | undefined
    const body = request.body as Record<string, string | undefined>

    if (!uploadedFile) {
      await this.renderPage(response, {
        title: 'Upload image',
        errorMessage: 'Provide an image file to upload.',
        formValues: {
          folder: body.folder,
        },
      })
      return
    }

    const input: UploadFileUseCaseInput = {
      file: {
        buffer: uploadedFile.buffer,
        mimeType: uploadedFile.mimetype,
        originalName: uploadedFile.originalname,
      },
      folder: body.folder?.trim() || undefined,
    }

    const uploadResult = await this.dependencies.uploadFileUseCase.execute(input)

    await this.renderPage(response, {
      title: 'Upload image',
      uploadResult,
      formValues: {
        folder: body.folder,
      },
    })
  }

  private async renderPage(response: Response, viewModel: UploadPageViewModel): Promise<void> {
    response.status(200)
    response.render('pages/upload-page', {
      title: viewModel.title,
      errorMessage: viewModel.errorMessage,
      uploadResult: viewModel.uploadResult,
      formValues: viewModel.formValues ?? {},
    })
  }
}