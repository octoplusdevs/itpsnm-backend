import { randomInt } from "crypto";
import { FilesRepository, FilesType } from "../files-repository";

export class InMemoryFilesRepository implements FilesRepository {
  public items: FilesType[] = []

  async create(data: FilesType): Promise<FilesType> {
    let newFile: FilesType = {
      id: data.id ?? randomInt(9999),
      name: data.name,
      format: data.format,
      path: data.path,
      studentId: data.studentId,
      type: data.type,
      created_at: data.created_at ?? new Date(),
      update_at: data.update_at ?? new Date()
    }
    this.items.push(newFile)
    return newFile
  }
  async findById(fileId: number): Promise<FilesType | null> {
    return this.items.find(file => file.id === fileId) || null
  }
  async destroy(fileId: number): Promise<Boolean> {
    const index = this.items.findIndex((item) => item.id === fileId)
    if (index !== -1) {
      this.items.splice(index, 1)
      return true
    }
    return false
  }

}
