import type { Request, Response } from 'express'
import type { FileUploadResult } from '../../domain/contracts/IFileStorage.js'
import type { UploadFileUseCase, UploadFileUseCaseInput } from '../../data/usecases/upload-file/upload-file-usecase.js'

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
      title: 'Cloudinary upload',
      formValues: {},
    })
  }

  async handleUpload(request: Request, response: Response): Promise<void> {
    const body = request.body as Record<string, string | undefined>
    const path = body.path?.trim()

    if (!path) {
      await this.renderPage(response, {
        title: 'Cloudinary upload',
        errorMessage: 'Provide a file path to upload.',
        formValues: {
          folder: body.folder,
          mimeType: body.mimeType,
          originalName: body.originalName,
        },
      })
      return
    }

    const input: UploadFileUseCaseInput = {
      file: {
        path,
        originalName: body.originalName,
      },
      folder: body.folder?.trim() || undefined,
    }

    const uploadResult = await this.dependencies.uploadFileUseCase.execute(input)

    await this.renderPage(response, {
      title: 'Cloudinary upload',
      uploadResult,
      formValues: {
        path: body.path,
        folder: body.folder,
        mimeType: body.mimeType,
        originalName: body.originalName,
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