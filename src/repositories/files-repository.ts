import { FileFormat, FileType } from '@prisma/client'

export interface FilesType {
  id?: number
  name: string
  studentId: number
  type: FileType
  format: FileFormat
  path: string
  created_at?: Date
  update_at?: Date
}
export interface FilesRepository {
  create(data: FilesType): Promise<FilesType>
  findById(fileId: number): Promise<FilesType | null>
  destroy(fileId: number): Promise<Boolean>

}
