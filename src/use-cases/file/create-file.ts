import { FilesRepository, FilesType } from '@/repositories/files-repository'
import { FileFormat, FileType } from '@prisma/client'

interface CreateFileUseCaseRequest {
  id?: number
  name: string
  studentId: number
  type: FileType
  format: FileFormat
  path: string
  created_at?: Date
  update_at?: Date
}

interface CreateFileUseCaseResponse {
  file: FilesType
}

export class CreateFileUseCase {
  constructor(private filesRepository: FilesRepository) { }

  async execute({
    format,
    path,
    name,
    studentId,
    type,
    created_at,
    id,
    update_at
  }: CreateFileUseCaseRequest): Promise<CreateFileUseCaseResponse> {
    const file = await this.filesRepository.create({
      format,
      path,
      name,
      studentId,
      type,
      created_at,
      id,
      update_at
    })

    return {
      file,
    }
  }
}
